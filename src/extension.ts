//imports
import * as fs from 'fs';
import * as vscode from 'vscode';
import { config } from './config';
import path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// auto-generated
export function activate(context: vscode.ExtensionContext) {
	let disposable: vscode.Disposable = vscode.commands.registerCommand(config.vscode.command, process);

	context.subscriptions.push(disposable);
}

/**
 * all happens here
 * 
 * 1) runs pull & merge 
 * 
 * 2) updates the version
 * 
 * 3) runs AL: Package
 */
function process(): void {
	let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage(config.msg.atLeastOneEditorOpenErr);
		return;
	}

	let filePath: string | undefined = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
	if (!filePath) {
		vscode.window.showErrorMessage(config.msg.projectPathNotFoundErr);
		return;
	}
	filePath = path.join(filePath, config.vscode.jsonFile);

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
 * runs AL: Package
 */
function alPackage(): void {
	let extension: vscode.Extension<any> | undefined = vscode.extensions.getExtension(config.vscode.alExtID);

	if (extension?.isActive)
		// eslint-disable-next-line curly
		vscode.commands.executeCommand('al.package');
}

/**
 * reads the JSON content, gets the version &amp; updates it using `updateVersion(version: string): string` &amp; writes the changes to the file
 * @param {string} filePath full path to the app.json file in the current header
 * @see {@link updateVersion}
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
 * 	updates the version using the following process:
 * 
 *  1) second-to-last number is set to today's date (according to the format settings in config)
 * 
 * 	2) the last digit is incremented by 1
 * 
 * @param version version from app.json
 * @returns new version with new numbers
*/
function updateVersion(version: string): string {
	const versionFormat: string = vscode.workspace.getConfiguration().get('ac-appjsonversionmanager.versionFormat', "yymmdd");

	let versionParts: string[] = version.split('.');

	if (versionFormat === "autoIncrement") {
		versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
	}
	else {
		let formattedDate: string = formatDate(versionFormat);
		versionParts[2] = formattedDate;
	}

	versionParts[3] = (parseInt(versionParts[3]) + 1).toString();

	let updatedVersion: string = versionParts.join('.');

	return updatedVersion;
}

/**
 * formats the current date using the provided format string from the config
 * @param format format of the date available from the config
 * @returns formatted date as a string
 */
function formatDate(format: string): string {
	let date: Date = new Date();
	return format.replace(/y{2,4}/g, match => {
		const year = date.getFullYear();
		const yearString = year.toString();
		const yearSlice = match.length === 2 ? yearString.slice(-2) : yearString;
		return yearSlice.padStart(match.length, '0');
	})
		.replace('mm', (date.getMonth() + 1).toString().padStart(2, '0'))
		.replace('dd', date.getDate().toString().padStart(2, '0'));
}

/**
 * gets the current repo used by this project &amp; synchronizes the default &amp; current branch
 * 
 * does not resolve any conflicts that may occur during the process as this should only be executed when all of the changes in code have already been pushed to the repo
 */
function syncBranch(): void {
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

	//ted to pada tady -> PROC??
	let repository: any | undefined = git.repositories.find((repo: { rootUri: { fsPath: string | undefined; }; }) => repo.rootUri?.fsPath === workspace?.uri.fsPath);

	if (!repository) {
		vscode.window.showErrorMessage(gitRepo_err);
		return;
	}

	cpcm(repository);

	vscode.window.showInformationMessage(config.msg.gitUpdated);
}

/**
 * checks out to the default branch, pulls, checks back, merges
 * @param repository retrieved repo from the vscode.git ext
 */
async function cpcm(repository: any): Promise<void> {
	const defaultBranch: string = vscode.workspace.getConfiguration().get('ac-appjsonversionmanager.mainBranchName', "main");

	let currentBranch: string = repository.state.HEAD.name;

	await repository.checkout(defaultBranch);
	await repository.pull('origin', defaultBranch);
	await repository.checkout(currentBranch);
	await repository.merge(defaultBranch);

	await repository.addChanges([config.vscode.jsonFile]);

	repository.exec('reflog');
}

// This method is called when your extension is deactivated
export function deactivate(): void { }
