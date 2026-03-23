import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

export function createWallpaperItem(dir, fileName) {
    const box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
        halign: Gtk.Align.CENTER,
    });

    box._fullPath = fileName;

    const lastDot = fileName.lastIndexOf(".");
    const baseName = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;

    const thumbPath = `${dir}/${baseName}.jpg`;
    const thumbFile = Gio.File.new_for_path(thumbPath);

    let image;
    if (thumbFile.query_exists(null)) {
        image = Gtk.Picture.new_for_filename(thumbPath);
    } else {
        image = new Gtk.Image({
            icon_name: "video-x-generic-symbolic",
            pixel_size: 48,
        });
    }

    image.set_size_request(160, 90);

    if (image instanceof Gtk.Picture) {
        image.set_content_fit(Gtk.ContentFit.COVER);
    }

    const label = new Gtk.Label({
        label: baseName,
        max_width_chars: 12,
        ellipsize: 3,
        halign: Gtk.Align.CENTER,
    });

    box.append(image);
    box.append(label);

    return box;
}