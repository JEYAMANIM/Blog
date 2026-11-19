import os
import shutil
import random
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.orm import sessionmaker, Session, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_4VqLTHWCsX9g@"
    "ep-spring-scene-ber1gwpw-pooler.c-9.us-east-2.aws.neon.tech/"
    "neondb?sslmode=require&channel_binding=require",
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=280,
    pool_size=5,
    max_overflow=10,
    connect_args={"connect_timeout": 10},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Blog(Base):
    __tablename__ = "blogs"
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    content = Column(Text)
    image_url = Column(String(500))


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://blog-editor-4uh.pages.dev",
    ],
    allow_origin_regex=r"https://.*\.blog-editor-4uh\.pages\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


class BlogCreate(BaseModel):
    title: str
    description: str
    content: str
    image_url: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/upload-image/")
async def upload_image(request: Request, file: UploadFile = File(...)):
    safe_name = file.filename.replace(" ", "_")
    file_path = f"uploads/{safe_name}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Preserve https:// when running behind Render/cloud proxies
    scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
    host = request.headers.get("host", request.url.netloc)
    file_url = f"{scheme}://{host}/uploads/{safe_name}"

    return {"image_url": file_url}


@app.post("/blogs/")
def create_blog(blog: BlogCreate, db: Session = Depends(get_db)):
    def generate_ip_id():
        return (
            f"{random.randint(1, 255)}."
            f"{random.randint(0, 255)}."
            f"{random.randint(0, 255)}."
            f"{random.randint(1, 255)}"
        )

    new_id = generate_ip_id()
    while db.query(Blog).filter(Blog.id == new_id).first() is not None:
        new_id = generate_ip_id()

    db_blog = Blog(
        id=new_id,
        title=blog.title,
        description=blog.description,
        content=blog.content,
        image_url=blog.image_url,
    )

    db.add(db_blog)
    try:
        db.commit()
        db.refresh(db_blog)
        return db_blog
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error saving the blog post.")


@app.get("/blogs/")
def get_blogs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return (
        db.query(Blog)
        .order_by(Blog.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


@app.get("/blogs/{blog_id}")
def get_blog(blog_id: str, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog