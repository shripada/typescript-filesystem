import {CFolder, CFile} from './file-system';

function checkTheParentChildRelation(parent: CFolder, child: CFile): void {
  expect(child.parent).not.toBeFalsy();
  expect(child.parent).toBe(parent);
  expect(parent.contains(child)).toBeTruthy();
}
describe('File system tests', () => {
  let rootFolder: CFolder;
  let timeStamp: number;
  beforeAll(() => {
    timeStamp = new Date().getTime();
    rootFolder = new CFolder('root', timeStamp, 0, undefined);
  });

  afterEach(() => {
    // Delete everything in root, and build a known file system heirarchy
    // Delete each of its children so that we are left with just root
    rootFolder.contents.forEach((fileOrFolder: CFile) => fileOrFolder.delete(true));
  });
  let rf2: CFile;
  let rf1: CFolder;
  let rf1_f2_f4: CFile;

  beforeEach(() => {
    rf1 = rootFolder.createFile('rf1', 0, true) as CFolder;
    rf2 = rootFolder.createFile('rf2', 100, false);
    rootFolder.createFile('rf3', 200, false);
    rootFolder.createFile('rf4', 300, false);

    rf1.createFile('rf1-f1', 100, false);
    const rf1_f2 = rf1.createFile('rf1-f2', 0, true) as CFolder;
    rf1.createFile('rf1-f3', 100, false);
    rf1.createFile('rf1-f4', 100, false);

    rf1_f2.createFile('rf1-f2-f1', 100, false);
    rf1_f2.createFile('rf1-f2-f2', 100, false);
    rf1_f2.createFile('rf1-f2-f3', 100, false);
    rf1_f2_f4 = rf1_f2.createFile('rf1-f2-f4', 100, false);
  });

  test('Creating a root folder', () => {
    expect(rootFolder.name).toBe('root');
    expect(rootFolder.creationDate).toBe(timeStamp);
    expect(rootFolder.parent).toBe(undefined);
    expect(rootFolder.contents.length).toBe(4);
  });
  test('creating file system heirarchy', () => {
    const firstFile = rootFolder.createFile('firstFile', 100, false);
    checkTheParentChildRelation(rootFolder, firstFile);
    expect(firstFile.name).toBe('firstFile');
    expect(firstFile.size()).toBe(100);

    const rootSub: CFolder = rootFolder.createFile('rootSub', 0, true) as CFolder;
    checkTheParentChildRelation(rootFolder, rootSub);

    // We want to create a file inside rootSub
    const fileInRootSub = rootSub.createFile('fileInRootSub', 250, false);
    checkTheParentChildRelation(rootSub, fileInRootSub);

    // Check that grand parent of fileInRootSub
    expect(fileInRootSub?.parent?.parent).toBe(rootFolder);

    // Check the path of fileInRootSub
    // root/rootSub/fileInRootSub
    expect(fileInRootSub.path()).toBe('/root/rootSub/fileInRootSub');
    expect(rootFolder.path()).toBe('/root');

    // size of root
    expect(rootFolder.size()).toBe(1650);

    // Test deletion
    // Trying to delete
    const parent = fileInRootSub?.parent;
    expect(parent?.contains(fileInRootSub)).toBeTruthy();
    fileInRootSub.delete();
    expect(parent?.contains(fileInRootSub)).toBeFalsy();

    const file1InRootSub = rootSub.createFile('file1InRootSub', 250, false);
    checkTheParentChildRelation(rootSub, file1InRootSub);
    expect(() => rootSub.delete()).toThrow();
    rootSub.delete(true);
    expect(rootFolder.contains(rootSub)).toBeFalsy();
  });

  test('searching for a file or folder using relative path', () => {
    const fileRefToRf2 = rf2.search('rf2');
    expect(fileRefToRf2).toBeDefined();
    expect(fileRefToRf2?.name).toBe('rf2');
    expect(fileRefToRf2?.size()).toBe(100);

    expect(fileRefToRf2?.search('foo')).toBeUndefined();
  });

  test('searching for a folder', () => {
    expect(rf1.search('rf1')).toBe(rf1);
    expect(rootFolder.search('root/rf1')).toBe(rf1);
    expect(rootFolder.search('root/rf1/rf1-f2/rf1-f2-f4')).toBe(rf1_f2_f4);
    expect(rootFolder.search('root/rf1/rf1-f3/rf1-f2-f4')).toBeUndefined();
  });
});
