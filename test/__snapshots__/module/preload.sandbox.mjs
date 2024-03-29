const electron = require("electron");
electron.clipboard;
electron.contextBridge;
electron.crashReporter;
electron.ipcRenderer;
electron.nativeImage;
electron.shell;
electron.webFrame;
if (process.sandboxed) {
  throw new Error(`node:fs is the Node.js module, please set "nodeIntegration: true" in the main process.`);
}
const _M_$1 = require("node:fs");
_M_$1.appendFile;
_M_$1.appendFileSync;
_M_$1.access;
_M_$1.accessSync;
_M_$1.chown;
_M_$1.chownSync;
_M_$1.chmod;
_M_$1.chmodSync;
_M_$1.close;
_M_$1.closeSync;
_M_$1.copyFile;
_M_$1.copyFileSync;
_M_$1.cp;
_M_$1.cpSync;
_M_$1.createReadStream;
_M_$1.createWriteStream;
_M_$1.exists;
_M_$1.existsSync;
_M_$1.fchown;
_M_$1.fchownSync;
_M_$1.fchmod;
_M_$1.fchmodSync;
_M_$1.fdatasync;
_M_$1.fdatasyncSync;
_M_$1.fstat;
_M_$1.fstatSync;
_M_$1.fsync;
_M_$1.fsyncSync;
_M_$1.ftruncate;
_M_$1.ftruncateSync;
_M_$1.futimes;
_M_$1.futimesSync;
_M_$1.lchown;
_M_$1.lchownSync;
_M_$1.lchmod;
_M_$1.lchmodSync;
_M_$1.link;
_M_$1.linkSync;
_M_$1.lstat;
_M_$1.lstatSync;
_M_$1.lutimes;
_M_$1.lutimesSync;
_M_$1.mkdir;
_M_$1.mkdirSync;
_M_$1.mkdtemp;
_M_$1.mkdtempSync;
_M_$1.open;
_M_$1.openSync;
_M_$1.opendir;
_M_$1.opendirSync;
_M_$1.readdir;
_M_$1.readdirSync;
_M_$1.read;
_M_$1.readSync;
_M_$1.readv;
_M_$1.readvSync;
_M_$1.readFile;
_M_$1.readFileSync;
_M_$1.readlink;
_M_$1.readlinkSync;
_M_$1.realpath;
_M_$1.realpathSync;
_M_$1.rename;
_M_$1.renameSync;
_M_$1.rm;
_M_$1.rmSync;
_M_$1.rmdir;
_M_$1.rmdirSync;
_M_$1.stat;
_M_$1.statfs;
_M_$1.statSync;
_M_$1.statfsSync;
_M_$1.symlink;
_M_$1.symlinkSync;
_M_$1.truncate;
_M_$1.truncateSync;
_M_$1.unwatchFile;
_M_$1.unlink;
_M_$1.unlinkSync;
_M_$1.utimes;
_M_$1.utimesSync;
_M_$1.watch;
_M_$1.watchFile;
_M_$1.writeFile;
_M_$1.writeFileSync;
_M_$1.write;
_M_$1.writeSync;
_M_$1.writev;
_M_$1.writevSync;
_M_$1.Dir;
_M_$1.Dirent;
_M_$1.Stats;
_M_$1.ReadStream;
_M_$1.WriteStream;
_M_$1.FileReadStream;
_M_$1.FileWriteStream;
_M_$1._toUnixTimestamp;
_M_$1.F_OK;
_M_$1.R_OK;
_M_$1.W_OK;
_M_$1.X_OK;
_M_$1.constants;
_M_$1.promises;
const keyword_default$1 = _M_$1.default || _M_$1;
const _M_ = require("timers");
_M_.setTimeout;
_M_.clearTimeout;
_M_.setImmediate;
_M_.clearImmediate;
_M_.setInterval;
_M_.clearInterval;
_M_._unrefActive;
_M_.active;
_M_.unenroll;
_M_.enroll;
const keyword_default = _M_.default || _M_;
console.log(electron, keyword_default$1, keyword_default);
