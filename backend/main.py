from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import tempfile
import shutil
from agents.code_agent import manim_agent
from agents.debugger_agent import debugger_agent
from agents.decompose_agent import animation_decomposer_agent
from agents.updater_agent import updater_agent
from utils import run_manim_code, extract_scene_class_name, clean_manim_code
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Get allowed origins from environment variable, default to localhost for development
# In production, set ALLOWED_ORIGINS env var to your frontend URL(s)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
  CORSMiddleware,
  allow_origins=allowed_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
STATIC_VIDEOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static_videos")

if not os.path.exists(STATIC_VIDEOS_DIR):
    os.makedirs(STATIC_VIDEOS_DIR)
app.mount("/videos", StaticFiles(directory=STATIC_VIDEOS_DIR), name="static_videos")

@app.get("/generate-animation")
async def generate_animation(query: str):
    temp_dir = tempfile.mkdtemp()
    video_url = None
    try:
        enhanced_query = animation_decomposer_agent.run(query).content
        manim_code_result = manim_agent.run(enhanced_query).content
        manim_code = clean_manim_code(manim_code_result)
        scene_name = extract_scene_class_name(manim_code)
        
        if not scene_name:
            return {
                "manim_code": manim_code,
                "video_path": None,
                "stdout": "",
                "stderr": "Could not automatically find a Scene class name in the generated code."
            }
            
        video_fs_path, stdout, stderr = run_manim_code(manim_code, temp_dir, scene_name)
        
        if video_fs_path:
            video_url = f"/videos/{os.path.basename(video_fs_path)}"
        elif stderr: 
            for i in range(1, 3):
                debug_input = f"Code: {manim_code}\nError: {stderr}"
                manim_code_result = debugger_agent.run(debug_input).content
                manim_code = clean_manim_code(manim_code_result)
                scene_name = extract_scene_class_name(manim_code)
                if not scene_name:
                    stderr = stderr + "\nDebugger failed to produce a valid scene name."
                    break 
                video_fs_path, stdout, stderr = run_manim_code(manim_code, temp_dir, scene_name)
                if video_fs_path:
                    video_url = f"{os.path.basename(video_fs_path)}"
                    break

        return {
            "manim_code": manim_code,
            "video_path": video_url, 
            "stdout": stdout,
            "stderr": stderr
        }
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


@app.get("/update-animation")
async def update_animation(query: str, manim_code_input:str): 
    temp_dir = tempfile.mkdtemp()
    video_url = None 
    manim_code_to_return = manim_code_input 
    try:
        enhanced_query = animation_decomposer_agent.run(query).content
        updater_input = f"Query to make changes: {enhanced_query}\nManim code: {manim_code_input}"
        updated_manim_code_result = updater_agent.run(updater_input).content
        current_manim_code = clean_manim_code(updated_manim_code_result)
        manim_code_to_return = current_manim_code 
        scene_name = extract_scene_class_name(current_manim_code)

        if not scene_name:
            return {
                "manim_code": manim_code_to_return,
                "video_path": None,
                "stdout": "",
                "stderr": "Could not automatically find a Scene class name in the updated code."
            }

        video_fs_path, stdout, stderr = run_manim_code(current_manim_code, temp_dir, scene_name)
        
        if video_fs_path:
            video_url = f"/videos/{os.path.basename(video_fs_path)}"
        elif stderr: 
            for i in range(1, 3):
                debug_input = f"Code: {current_manim_code}\nError: {stderr}"
                debugged_code_result = debugger_agent.run(debug_input).content
                current_manim_code = clean_manim_code(debugged_code_result)
                manim_code_to_return = current_manim_code 
                scene_name = extract_scene_class_name(current_manim_code)
                if not scene_name:
                    stderr = stderr + "\nDebugger failed to produce a valid scene name during update."
                    break
                video_fs_path, stdout, stderr = run_manim_code(current_manim_code, temp_dir, scene_name)
                if video_fs_path:
                    video_url = f"/videos/{os.path.basename(video_fs_path)}"
                    break
        
        return {
            "manim_code": manim_code_to_return,
            "video_path": video_url, 
            "stdout": stdout,
            "stderr": stderr
        }
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
