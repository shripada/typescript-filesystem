/** File system consists of Files and Folders. We also expose another class called
 * as FileSystem, that is going to have a root folder in it for us.
 */

import {assert} from 'console';

/**
 * File represents the fundamental entity in a file system. This
 * forms the base class of all entities of a file system.
 */
class CFile {
  name: string;
  creationDate: number; // epoch timestamp
  parent?: CFolder;
  _size: number;

  constructor(name: string, creationDate: number, size: number, parent: CFolder | undefined) {
    this.name = name;
    this.creationDate = creationDate;
    this.parent = parent;
    this._size = size;
  }

  size(): number {
    // TODO: compute the size and return
    return this._size;
  }

  path(): string {
    return `${this.parent?.path() ?? ''}/${this.name}`; // <path of parent>/<name>
  }

  delete(force: boolean = false): void {
    // if this is a file, delete it right away
    // if it is a folder and force is set, then delete that too right away.
    // get its parent, and remove this object from parent's contents
    if (this.parent !== undefined) {
      this.parent.contents = this.parent.contents.filter(file => file.name !== this.name);
      this.parent = undefined;
    }
  }

  /**
   * Searching of a file in the heirachy will require just the name of
   * the file. if the passed in name matches this file, we will return
   * this file, otherwise we return undefined.
   */
  search(relativePath: string): CFile | undefined {
    if (this.name.toLowerCase() === relativePath.toLowerCase()) {
      return this;
    }
  }
}

/** Folder is a file, but additionally can contain other files and folders */

class CFolder extends CFile {
  contents: CFile[] = [];
  size(): number {
    // sum up the sizes of the contents
    return this.contents.reduce((accumulated: number, currentItem: CFile) => accumulated + currentItem.size(), 0);
  }

  /** creates a file or folder within this folder, the newly created
   * file or folder will have its parent set to this folder. If the file or folder
   * already exists, we simply return that.
   */
  createFile(name: string, size: number = 0, isDirectory: boolean = false): CFile | never {
    const existingFile = this.contents.find(currentFile => currentFile.name.toLowerCase() === name.toLowerCase());
    if (existingFile !== undefined) {
      if (isDirectory) {
        if (!(existingFile instanceof CFolder)) {
          throw new Error(`Trying to create a folder ${name}, but a file already exists with this name`);
        }
        return existingFile;
      } else {
        if (existingFile instanceof CFile) {
          throw new Error(`Trying to create a file ${name}, but a folder already exists with this name`);
        }
      }
    }

    if (isDirectory) {
      const directory = new CFolder(name, new Date().getTime(), 0, this);
      this.contents.push(directory);
      return directory;
    } else {
      const file = new CFile(name, new Date().getTime(), size, this);
      this.contents.push(file);
      return file;
    }
  }
  // Orthogonal interface will always have counterpart APIs
  // For example, create/delete, open/close, send/recieve

  /**
   * containsFile will tell if the given file is a child of this
   * folder
   */
  contains(fileIn: CFile): boolean {
    return this.contents.some(file => file.name === fileIn.name);
  }

  /** deleting a folder */
  delete(force: boolean = false): void {
    let canDeleteImmediately = false;
    if (force || this.contents.length === 0) {
      canDeleteImmediately = true;
    }
    // Guarding the root deletion
    if (this.parent === undefined) {
      canDeleteImmediately = false;
    }
    if (canDeleteImmediately) {
      super.delete(force);
    } else {
      // We should not delete a folder that might contain items
      // We shall allow by default deleting only those folders
      // which do not have any contents in them.
      // files on the other hand can be deleted right away.
      throw new Error(`Folder ${this.path()} can not be deleted as it is not empty or it is root folder itself!`);
    }
  }

  /** we want to support a depth first search in the folder heirarchy */
  search(relativePath: string): CFile | undefined {
    // First we need to get first path component
    const pathComponents = relativePath.split('/');
    expect(pathComponents.length).toBeGreaterThanOrEqual(1);
    if (this.name.toLowerCase() === pathComponents[0].toLowerCase()) {
      // Get the subpath sans the current folder. That will be
      // the relative path down the heirarchy
      pathComponents.shift();
      if (pathComponents.length === 0) {
        return this;
      }
      const subComponents = pathComponents;
      const subPath = subComponents.join('/');
      for (const content of this.contents) {
        const searchResult = content.search(subPath);
        if (searchResult !== undefined) {
          return searchResult;
        }
      }
    }
  }
}

export {CFile, CFolder};
