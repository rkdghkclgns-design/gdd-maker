// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct ApiKeyPayload {
    key: String,
}

// 평문 파일 기반 키 저장 (OS 키체인 통합은 추후 확장)
// 위치: $APPDATA/com.you.gdd-maker/api-key.txt
fn key_file_path(app: &tauri::AppHandle) -> Option<PathBuf> {
    let dir = app.path_resolver().app_local_data_dir()?;
    fs::create_dir_all(&dir).ok()?;
    Some(dir.join("api-key.txt"))
}

#[tauri::command]
fn save_api_key(app: tauri::AppHandle, key: String) -> Result<(), String> {
    let path = key_file_path(&app).ok_or("앱 데이터 폴더를 찾을 수 없습니다.")?;
    fs::write(&path, key).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_api_key(app: tauri::AppHandle) -> Result<String, String> {
    let path = key_file_path(&app).ok_or("앱 데이터 폴더를 찾을 수 없습니다.")?;
    if !path.exists() {
        return Ok(String::new());
    }
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn clear_api_key(app: tauri::AppHandle) -> Result<(), String> {
    let path = key_file_path(&app).ok_or("앱 데이터 폴더를 찾을 수 없습니다.")?;
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_api_key, load_api_key, clear_api_key])
        .run(tauri::generate_context!())
        .expect("error while running GDD 메이커");
}
