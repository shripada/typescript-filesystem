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
  test('Creating a root folder', () => {
    expect(rootFolder.name).toBe('root');
    expect(rootFolder.creationDate).toBe(timeStamp);
    expect(rootFolder.parent).toBe(undefined);
    expect(rootFolder.contents.length).toBe(0);
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
    expect(rootFolder.size()).toBe(350);

    // Test deletion
    // Trying to delete
  });
});
