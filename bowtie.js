if (process.argv[2]) {
const fs = require("fs");

var funcs = {
    print: function(a) {
        console.log(a);
    },
    writeFile: function(array) {
        if (typeof array == "object") {
            var filename = array.shift();
            var contents = array.pop()
            fs.writeFileSync(filename, contents);
        } else {
            console.log("ERROR: argument is not in type of Array.")
        }
    },
    run_custom_func: function(f) {
        f()
    },
    eval_js: function(func) {
        eval(func)
    }
}

function split_than_signs(str) {
    var a2 = [];
    str.split("<").forEach(function(e) {
        var h = e.split(">")
        if (h.length == 1) {
            h = h[0];
        }
        a2.push(h)
    })
    var a3 = [];
    a2.forEach(function(e) {
        var type = typeof e;
        if (type == "object") {
            a3.push("<" + e[0] + ">");
            a3.push(e[1]);
        } else {
            a3.push(e);
        }
    })
    return a3;
}

var file = fs.readFileSync(process.argv[2]).toString();

file.split("\n").forEach(function(file) {
    var split = split_than_signs(file).slice(1, split_than_signs(file).length);

    var functions = [];
    var args = [];
    var variables = [];
    split.forEach(function(e) {
        if (e.startsWith("<") && e.endsWith(">")) {
            var e_f = e.slice(0, -1);
            e_f = e_f.slice(1, e_f.length);
            if (funcs[e_f] && e_f !== "VAR") {
                args.push(eval(split.pop()))
                functions.push(e_f);
            } else if (e_f !== "VAR") {
                console.log("ERROR: function " + e_f + " not found!")
            } else {
                variables.push(split.pop());
            }
        }
    })

    variables.forEach(function(v) {
        eval(`global.${v}`)
    })

    functions.forEach(function(fn, i) {
        funcs[fn](args[i]);
    })
})
} else {
	console.log("Bowtie - ERROR: no file to interpret!")
}
