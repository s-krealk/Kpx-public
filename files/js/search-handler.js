document.addEventListener("DOMContentLoaded", function () {
    const connection = new BareMux.BareMuxConnection("/baremux/worker.js")
    const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    const bareUrl = (location.protocol === "https:" ? "https" : "http") + "://" + location.host + "/bare/"
    document // makes it so you can press enter to submit as opposed to just being able to press a button
        .getElementById("uv-address")
        .addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("searchButton").click();
            }
        });

    document.getElementById("searchButton").onclick = async function (event) {
        event.preventDefault();

        let url = document.getElementById("uv-address").value; // if no periods are detected in the input, search google instead
        let searchUrl = "https://duckduckgo.com/";

        if (!url.includes(".")) {
            url = searchUrl + encodeURIComponent(url);
        } else {
            if (!url.startsWith("http://") && !url.startsWith("https://")) { // if no http or https is detected, add https automatically
                url = "https://" + url;
                document.getElementById("uv-address").value = url;
            }
        }
        if (!await connection.getTransport()) {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }
        document.getElementById("uv-frame").src = __uv$config.prefix + __uv$config.encodeUrl(url);
    };
    document.getElementById("switcher").value = "epoxy";
    document.getElementById("switcher").onselect = async function (event) {
        switch (event.target.value) {
            case "epoxy":
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                break;
            case "bare":
                await connection.setTransport("/baremod/index.mjs", [bareUrl]);
                break;
        }
    }
});