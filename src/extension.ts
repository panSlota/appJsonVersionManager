//nezbytny importy
import * as fs from 'fs';
import * as vscode from 'vscode';
import { config } from './config';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// auto-generated
export function activate(context: vscode.ExtensionContext) {
	let disposable: vscode.Disposable = vscode.commands.registerCommand(config.vscode.command, process);

	context.subscriptions.push(disposable);
}

/**
 * tady se to vsecko stane:
 * 
 * 1) zanda pull & merge (snad bez konfliktu)
 * 
 * 2) zvedne verzi
 * 
 * 3) zanda AL: Package
 */
function process(): void {
	let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage(config.msg.pojeb);
		return;
	}

	let filePath: string | undefined = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
	if (!filePath) {
		vscode.window.showErrorMessage(config.msg.projectPathNotFoundErr);
		return;
	}

	try {
		syncBranch();
		updateJson(filePath);
		alPackage();
	}
	catch (err: any) {
		vscode.window.showErrorMessage(config.msg.err.replace('%1', err.message));
	}
}

/**
 * spusti AL: Package
 */
function alPackage(): void {
	let extension: vscode.Extension<any> | undefined = vscode.extensions.getExtension(config.vscode.alExtID);

	if (extension?.isActive)
		vscode.commands.executeCommand('al.package');
}

/**
 * precte si JSON, sezene verzi, tu aktualizuje pomoci ```updateVersion(version: string)```, zapise zpatky do jsonu a jde do pici
 * @param {string} filePath cesta k app.json v aktualnim projektu
 * @see updateVersion
 */
function updateJson(filePath: string): void {
	try {
		let fileContent: string | undefined = fs.readFileSync(filePath, 'utf-8');
		let jsonContent: any = JSON.parse(fileContent);

		jsonContent.version = updateVersion(jsonContent.version);
		let updatedContent: string = JSON.stringify(jsonContent, null, 2);

		fs.writeFileSync(filePath, updatedContent, 'utf-8');

		vscode.window.showInformationMessage(config.msg.versionUpdated);
	}
	catch (error: any) {
		vscode.window.showErrorMessage(config.msg.err.replace('%1', error.message));
	}
}

/**
 * 	aktualizuje verzi zavedenym zpusobem:
 * 
 * 	1) predposledni cislo nastavi na odpovidajici interpretaci dnesniho data
 * 
 * 	2) posledni cislo zvedne o 1
 * 
 * @param version verze nactena z app.json
 * @returns nova verze ve stejnym formatu ale s novejma cislickama
*/
function updateVersion(version: string): string {
	let versionParts: string[] = version.split('.');

	let currentDate: Date = new Date();
	let year: string = currentDate.getFullYear().toString().slice(-2);
	let month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0');
	let day: string = currentDate.getDate().toString().padStart(2, '0');

	versionParts[2] = `${year}${month}${day}`;
	versionParts[3] = (parseInt(versionParts[3]) + 1).toString();

	let updatedVersion: string = versionParts.join('.');

	return updatedVersion;
}

/**
 * pomoci API poskytovanyho git ext ve vs code provede merge do aktualni vetve s pullnutym masterem
 * 
 * bacha, neresi to konflikty pri merge!!
 */
async function syncBranch(): Promise<void> {
	const workspace_err: string = 'otevři si projekt!';
	const gitExt_err: string = 'nefunguje git ext!';
	const gitRepo_err: string = 'git repo má problém, netuším jakej';

	let workspace: vscode.WorkspaceFolder | undefined = vscode.workspace.workspaceFolders?.[0];
	if (!workspace) {
		vscode.window.showErrorMessage(workspace_err);
		return;
	}

	let gitExt: vscode.Extension<any> | undefined = vscode.extensions.getExtension('vscode.git');
	if (!gitExt || !gitExt.isActive) {
		vscode.window.showErrorMessage(gitExt_err);
		return;
	}

	let git: any = gitExt.exports;

	let repository: any | undefined = git.repositories.find((repo: { rootUri: { fsPath: string | undefined; }; }) => repo.rootUri?.fsPath === workspace?.uri.fsPath);

	if (!repository) {
		vscode.window.showErrorMessage(gitRepo_err);
		return;
	}

	let currentBranch: string = repository.state.HEAD.name;

	await repository.checkout(config.git.masterBranchName);
	await repository.pull('origin', config.git.masterBranchName);
	await repository.checkout(currentBranch);
	await repository.merge(config.git.masterBranchName);

	repository.exec('reflog');

	vscode.window.showInformationMessage(config.msg.gitUpdated);
}

// This method is called when your extension is deactivated
export function deactivate(): void { }
