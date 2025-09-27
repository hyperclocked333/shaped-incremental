// Load files

function loadScripts(files) {
    for (let file of files) {
        if (Array.isArray(file)) {
            loadScripts(file);
        } else {
            let script = document.createElement("script");
            script.setAttribute("src", "js/" + file);
            script.setAttribute("async", "false");
            document.head.insertBefore(script, document.getElementById("temp"));
        }
    }
}

loadScripts(modInfo.modFiles);
