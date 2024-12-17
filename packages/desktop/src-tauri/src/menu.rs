use tauri::{
	menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem},
	App, Wry,
};

pub(crate) fn create_menu(app: &mut App) -> Result<Menu<Wry>, Box<dyn std::error::Error>> {
	let handle = app.handle();

	let authors = [
		"Tulpenkiste".to_string(),
		"Rexogamer".to_string(),
		"amycatgirl".to_string(),
	];

	let a = AboutMetadata {
		name: Some("Upryzing".to_string()),
		version: Some("0.0.1".to_string()),
		short_version: Some("0.0.1".to_string()),
		authors: Some(authors.to_vec()),
		comments: None,
		copyright: None,
		license: Some("AGPL-v3".to_string()),
		website: Some("https://upryzing.app".to_string()),
		website_label: Some("Homepage".to_string()),
		credits: None,
		icon: None,
	};

	let seperator = PredefinedMenuItem::separator(handle)?;
	let abt = PredefinedMenuItem::about(handle, Some("About Upryzing"), Some(a))?;

	let show_i = MenuItem::with_id(handle, "show", "Show Upryzing", true, None::<&str>)?;
	let quit_i = MenuItem::with_id(handle, "quit", "Quit", true, None::<&str>)?;
	let menu = Menu::with_items(handle, &[&abt, &seperator, &show_i, &seperator, &quit_i])?;

	Ok(menu)
}
