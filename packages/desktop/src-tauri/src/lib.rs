use tauri::{
	menu::{Menu, MenuItem},
	tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
	Manager,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.setup(|app| {
			let show_i =
				MenuItem::with_id(app, "show", "Show Upryzing Window", true, None::<&str>)?;
			let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
			let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

			if cfg!(debug_assertions) {
				app.handle().plugin(
					tauri_plugin_log::Builder::default()
						.level(log::LevelFilter::Info)
						.build(),
				)?;
			}

			TrayIconBuilder::new()
				.icon(app.default_window_icon().unwrap().clone())
				.menu(&menu)
				.menu_on_left_click(false)
				.on_tray_icon_event(|tray, event| match event {
					TrayIconEvent::Click {
						button: MouseButton::Left,
						button_state: MouseButtonState::Up,
						..
					} => {
						println!("left click pressed and released");

						let app = tray.app_handle();
						if let Some(window) = app.get_webview_window("main") {
							let _ = window.show();
							let _ = window.set_focus();
						}
					}
					_ => {
						println!("unhandled event {event:?}");
					}
				})
				.on_menu_event(|app, event| match event.id.as_ref() {
					"show" => {
						println!("show menu item clicked");

						if let Some(window) = app.get_webview_window("main") {
							let _ = window.show();
							let _ = window.set_focus();
						}
					}
					"quit" => {
						println!("quit menu item was clicked");
						app.exit(0);
					}
					_ => {
						println!("menu item {:?} not handled", event.id);
					}
				})
				.build(app)?;

			Ok(())
		})
		.on_window_event(|app, event| {
			if let tauri::WindowEvent::CloseRequested { api, .. } = event {
				api.prevent_close();
				app.hide().unwrap();
			}
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
