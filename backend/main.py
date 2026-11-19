import os
import shutil
import random
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.orm import sessionmaker, Session, declarative_base

DATABASE_URL = (
    "postgresql://neondb_owner:npg_4VqLTHWCsX9g@"
    "ep-spring-scene-ber1gwpw-pooler.c-9.us-east-2.aws.neon.tech/"
    "neondb?sslmode=require&channel_binding=require"
)

# Resilient pool settings for Neon serverless PostgreSQL
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,              # Checks if the connection is alive before every query
    pool_recycle=280,                # Recycles connections before Neon's ~5 min idle timeout
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
    allow_origins=["http://localhost:5173"],
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
async def upload_image(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"http://localhost:8000/uploads/{file.filename}"
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