#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
    CustomMenuItem,
    Manager,
    SystemTray,
    SystemTrayEvent,
    SystemTrayMenu,
    SystemTrayMenuItem,
};

fn main() {
  let tray_menu = SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("title".to_string(), "Upryzing").disabled())
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(CustomMenuItem::new("open".to_string(), "Open Upryzing"))
    .add_item(CustomMenuItem::new("hide".to_string(), "Hide Upryzing"))
    .add_item(CustomMenuItem::new("quit".to_string(), "Quit Upryzing"));

  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        event.window().hide().unwrap();
        api.prevent_close();
      }
      _ => {}
    })
    .setup(| app | {
      if cfg!(any(windows, target_os = "macos")) {
        use window_shadows::set_shadow;
        let window = app.get_window("main").unwrap();
        set_shadow(&window, true).unwrap_or_default();
      }

      Ok(())
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("main").unwrap();
        
        if window.set_focus().is_err() {
          println!("[on_system_tray_event][:LeftClick] error when trying to set main window focus.");
        }
      }
      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "open" => {
          let window = app.get_window("main").unwrap();
          window.show().unwrap();
          window.set_focus().unwrap();
        }
        "hide" => {
          let window = app.get_window("main").unwrap();
          window.hide().unwrap();
        }
        "quit" => {
          std::process::exit(0);
        }
        _ => {}
      },
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
