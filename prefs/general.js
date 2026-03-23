import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

export function buildGeneralPage(settings) {
    const page = new Adw.PreferencesPage({
        title: "General",
        icon_name: "preferences-system-symbolic",
    });

    const group = new Adw.PreferencesGroup({
        title: "Behavior",
    });

    const autostartRow = new Adw.ActionRow({
        title: "Autostart",
        subtitle: "Start wallpaper on login",
    });

    const autostartSwitch = new Gtk.Switch({ valign: Gtk.Align.CENTER });
    settings.bind("autostart", autostartSwitch, "active", Gio.SettingsBindFlags.DEFAULT);
    autostartRow.add_suffix(autostartSwitch);
    autostartRow.activatable_widget = autostartSwitch;

    const indicatorRow = new Adw.ActionRow({
        title: "Tray Icon",
        subtitle: "Show icon in the top panel",
    });

    const indicatorSwitch = new Gtk.Switch({ valign: Gtk.Align.CENTER });
    settings.bind("show-indicator", indicatorSwitch, "active", Gio.SettingsBindFlags.DEFAULT);
    indicatorRow.add_suffix(indicatorSwitch);
    indicatorRow.activatable_widget = indicatorSwitch;

    group.add(autostartRow);
    group.add(indicatorRow);
    page.add(group);

    return page;
}