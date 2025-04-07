use tauri::{
	menu::{Menu, MenuEvent, MenuItem},
	tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
	Builder, Manager,
};

use log;
use tauri_plugin_log::LogLevel;

mod menu;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn exec() {
	log::info!("Running app::exec");
	tauri::Builder::default()
		.plugin(tauri_plugin_log::Builder::new().build())
		.plugin(tauri_plugin_shell::init())
		.on_window_event(|window, event| match event {
			tauri::WindowEvent::CloseRequested { api, .. } => {
				window.hide().unwrap();
				api.prevent_close();
			}
			_ => {}
		})
		.setup(|app| {
			let menu = menu::create_menu(app).unwrap();

			let tray = TrayIconBuilder::new()
				.icon(app.default_window_icon().unwrap().clone())
				.menu(&menu)
				.on_tray_icon_event(|tray, event| match event {
					TrayIconEvent::Click {
						button: MouseButton::Left,
						..
					} => {
						let app = tray.app_handle();
						let window = app.get_webview_window("main").unwrap();

						if window.set_focus().is_err() {
							println!("[on_system_tray_event][:LeftClick] error when trying to set main window focus.");
						}
					}
					_ => {}
				})
				.on_menu_event(|app, event| match event.id.as_ref() {
					"open" => {
						let window = app.get_webview_window("main").unwrap();
						window.show().unwrap();
						window.set_focus().unwrap();
					}
					"hide" => {
						let window = app.get_webview_window("main").unwrap();
						window.hide().unwrap();
					}
					"quit" => {
						std::process::exit(0);
					}
					_ => {}
				})
				.build(app)?;

			if cfg!(any(windows, target_os = "macos")) {
				let window = app.get_webview_window("main").unwrap();
				window.set_shadow(true)?;
			}

			Ok(())
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
