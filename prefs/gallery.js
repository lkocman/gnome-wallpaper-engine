import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

import { createWallpaperItem } from "./wallpaperItem.js";

export function buildGalleryPage(ext, window, settings) {
    const page = new Adw.PreferencesPage({
        title: "Gallery",
        icon_name: "folder-videos-symbolic",
    });

    const group = new Adw.PreferencesGroup({
        title: "Wallpaper Selection",
        description: "Supported formats: MP4, WebM, MKV, MOV, AVI, GIF",
    });

    const addButton = new Gtk.Button({
        label: "Add Video/GIF",
        icon_name: "list-add-symbolic",
        margin_bottom: 12,
        css_classes: ["suggested-action"],
    });

    const flowBox = new Gtk.FlowBox({
        valign: Gtk.Align.START,
        max_children_per_line: 3,
        min_children_per_line: 2,
        selection_mode: Gtk.SelectionMode.SINGLE,
        row_spacing: 12,
        column_spacing: 12,
    });

    const refreshGallery = () => {
        let child = flowBox.get_first_child();
        while (child) {
            flowBox.remove(child);
            child = flowBox.get_first_child();
        }

        const bgDir = `${ext.path}/backgrounds`;
        const directory = Gio.File.new_for_path(bgDir);

        if (!directory.query_exists(null)) {
            try {
                directory.make_directory_with_parents(null);
            } catch (e) {
                console.error(e);
                return;
            }
        }

        try {
            const enumerator = directory.enumerate_children(
                "standard::name",
                Gio.FileQueryInfoFlags.NONE,
                null
            );

            let info;
            const supported = [".mp4", ".webm", ".gif", ".mkv", ".mov", ".avi"];

            while ((info = enumerator.next_file(null)) !== null) {
                const fileName = info.get_name();
                if (supported.some(ext => fileName.toLowerCase().endsWith(ext))) {
                    flowBox.append(createWallpaperItem(bgDir, fileName));
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    addButton.connect("clicked", () => {
        const chooser = new Gtk.FileChooserNative({
            title: "Select Video or GIF",
            action: Gtk.FileChooserAction.OPEN,
            modal: true,
            transient_for: window,
        });

        const filter = new Gtk.FileFilter();
        filter.add_mime_type("video/mp4");
        filter.add_mime_type("video/webm");
        filter.add_mime_type("image/gif");
        filter.add_mime_type("video/x-matroska");
        filter.add_mime_type("video/quicktime");
        filter.add_mime_type("video/x-msvideo");
        chooser.add_filter(filter);

        chooser.connect("response", (res, response_id) => {
            if (response_id === Gtk.ResponseType.ACCEPT) {
                const sourceFile = chooser.get_file();
                const destPath = `${ext.path}/backgrounds/${sourceFile.get_basename()}`;
                const destFile = Gio.File.new_for_path(destPath);

                try {
                    sourceFile.copy(destFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                    refreshGallery();
                } catch (e) {
                    console.error(e);
                }
            }
            chooser.destroy();
        });

        chooser.show();
    });

    flowBox.connect("child-activated", (box, child) => {
        settings.set_string("current-wallpaper", child.get_child()._fullPath);
    });

    refreshGallery();

    group.add(addButton);
    group.add(flowBox);
    page.add(group);

    return page;
}