const fs = require("fs");
const readline = require("readline");
 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
 
let gitInit = false;
let commits = 0;
 
function gitPull(endereco, file) {
    const novoArquivo = endereco;
    const pull = file;
 
    fs.readFile(novoArquivo, "utf-8", (erro, arquivo) => {
        if (erro) throw erro;
        fs.promises.writeFile(pull, arquivo).then(() => {
            console.log("'git pull' completed.");
        }).catch((error) => {
            throw error;
        });
    });
}
 
function criarArquivos(endereco, callback) {
    commits++;
    const write = `commits/commit${commits}.txt`;
 
    fs.readFile(endereco, "utf-8", (erro, texto) => {
        if (erro) throw erro;
        fs.promises.writeFile(write, texto).then(() => {
            console.log("New commit sucessfully completed.");
            if (callback) callback();
        }).catch((error) => {
            throw error;
        });
    });
}
 
function processCommand(cmd) {
    if (gitInit === true && cmd === "git status") {
        console.log("There is a repository");
    } else if (gitInit === true && cmd === "git log" && commits < 1) {
        console.log("There is no commits.");
    } else if (gitInit === true && cmd === "git add") {
        console.log("The 'git add' doesn't exist in my version of git, acess the readme file to learn more about my version of git.");
    } else if (cmd === "git init" && gitInit === false) {
        console.log("A new repository was created.");
        gitInit = true;
    } else if (cmd === "git init" && gitInit === true) {
        console.log("You already typed 'git init'");
    } else if (cmd === "git commit -m") {
        rl.question("Type the adress of the file you want to commit\n", (enderecoReadFile) => {
            criarArquivos(enderecoReadFile, () => {
                console.log(`The ID of this commit is commit${commits}`);
                askNext();
            });
        });
        return;
    } else if (cmd === "git pull" && commits < 1) {
        console.log("You haven't done any commit yet.");
    } else if (cmd === "git pull" && commits >= 1 && gitInit === true) {
        rl.question("Type the adress of the file you want to pull any commit\n", (sla) => {
            rl.question("Type the ID of the commit you want to pull (only the number of the ID)\n", (id) => {
                gitPull(`commits/commit${id}.txt`, sla);
                askNext();
            });
        });
        return;
    } else if (gitInit === true && cmd === "git log" && commits >= 1) {
        console.log(`You have done ${commits} commits.`);
    } else if (gitInit === false) {
        console.log(`You need to type 'git init' first or ${cmd} isn't a cmdlet.`);
    } else {
        console.log(`${cmd} isn't a cmdlet or you typed something wrong.`);
    }
 
    askNext();
}
 
function askNext() {
    rl.question("", (answer) => {
        processCommand(answer);
    });
}
 
askNext();
 