/**
 * Main Application - CLI Interface
 * File ini adalah entry point aplikasi
 * 
 * TODO: Implementasikan CLI interface yang interaktif dengan menu:
 * 1. Tambah Siswa Baru
 * 2. Lihat Semua Siswa
 * 3. Cari Siswa (by ID)
 * 4. Update Data Siswa
 * 5. Hapus Siswa
 * 6. Tambah Nilai Siswa
 * 7. Lihat Top 3 Siswa
 * 8. Keluar
 */

import readlineSync from 'readline-sync';
import Student from './src/Student.js';
import StudentManager from './src/StudentManager.js';

// optional color support
let chalk = null;
try {
  // eslint-disable-next-line node/no-extraneous-import
  chalk = (await import('chalk')).default;
} catch (e) {
  chalk = null;
}

// Inisialisasi StudentManager (data disimpan di students.json)
const manager = new StudentManager('students.json');

function color(text, style = 'green') {
  if (!chalk) return text;
  try {
    if (style === 'green') return chalk.green(text);
    if (style === 'red') return chalk.red(text);
    if (style === 'yellow') return chalk.yellow(text);
    if (style === 'blue') return chalk.blue(text);
    return text;
  } catch (e) {
    return text;
  }
}

/**
 * Menampilkan menu utama
 */
function displayMenu() {
  console.log('\n' + color('=================================', 'blue'));
  console.log(color('SISTEM MANAJEMEN NILAI SISWA', 'yellow'));
  console.log(color('=================================', 'blue'));
  console.log('1. Tambah Siswa Baru');
  console.log('2. Lihat Semua Siswa');
  console.log('3. Cari Siswa');
  console.log('4. Update Data Siswa');
  console.log('5. Hapus Siswa');
  console.log('6. Tambah Nilai Siswa');
  console.log('7. Lihat Top 3 Siswa');
  console.log('8. Filter by Kelas (Bonus)');
  console.log('9. Statistik Kelas (Bonus)');
  console.log('10. Export Laporan (Bonus)');
  console.log('11. Keluar');
  console.log(color('=================================', 'blue'));
}

/**
 * Handler untuk menambah siswa baru
 * TODO: Implementasikan function ini
 * - Minta input: ID, Nama, Kelas
 * - Buat object Student baru
 * - Tambahkan ke manager
 * - Tampilkan pesan sukses/gagal
 */
function addNewStudent() {
  console.log('\n' + color('--- Tambah Siswa Baru ---', 'green'));

  try {
    const id = readlineSync.question('Masukkan ID: ').trim();
    const name = readlineSync.question('Masukkan Nama: ').trim();
    const studentClass = readlineSync.question('Masukkan Kelas: ').trim();

    const student = new Student(id, name, studentClass);
    const ok = manager.addStudent(student);
    if (ok) console.log(color('Siswa berhasil ditambahkan!', 'green'));
    else console.log(color('Gagal: ID sudah digunakan.', 'red'));
  } catch (err) {
    console.log(color('Error: ' + err.message, 'red'));
  }
}

/**
 * Handler untuk melihat semua siswa
 * TODO: Implementasikan function ini
 * - Panggil method displayAllStudents dari manager
 * - Jika tidak ada siswa, tampilkan pesan
 */
function viewAllStudents() {
  console.log('\n' + color('--- Daftar Semua Siswa ---', 'green'));
  manager.displayAllStudents();
}

/**
 * Handler untuk mencari siswa berdasarkan ID
 * TODO: Implementasikan function ini
 * - Minta input ID
 * - Cari siswa menggunakan manager
 * - Tampilkan info siswa jika ditemukan
 */
function searchStudent() {
  console.log('\n' + color('--- Cari Siswa ---', 'green'));
  const id = readlineSync.question('Masukkan ID siswa: ').trim();
  const s = manager.findStudent(id);
  if (!s) {
    console.log(color('Siswa tidak ditemukan.', 'red'));
    return;
  }
  s.displayInfo();
}

/**
 * Handler untuk update data siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data saat ini
 * - Minta input data baru (nama, kelas)
 * - Update menggunakan manager
 */
function updateStudent() {
  console.log('\n' + color('--- Update Data Siswa ---', 'green'));
  const id = readlineSync.question('Masukkan ID siswa: ').trim();
  const s = manager.findStudent(id);
  if (!s) {
    console.log(color('Siswa tidak ditemukan.', 'red'));
    return;
  }
  console.log('Data saat ini:');
  s.displayInfo();
  const newName = readlineSync.question('Nama baru (kosongkan jika tidak diubah): ').trim();
  const newClass = readlineSync.question('Kelas baru (kosongkan jika tidak diubah): ').trim();

  const data = {};
  if (newName !== '') data.name = newName;
  if (newClass !== '') data.class = newClass;

  const ok = manager.updateStudent(id, data);
  if (ok) console.log(color('Data berhasil diperbarui.', 'green'));
  else console.log(color('Gagal memperbarui data.', 'red'));
}

/**
 * Handler untuk menghapus siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Konfirmasi penghapusan
 * - Hapus menggunakan manager
 */
function deleteStudent() {
  console.log('\n' + color('--- Hapus Siswa ---', 'green'));
  const id = readlineSync.question('Masukkan ID siswa: ').trim();
  const confirm = readlineSync.question('Yakin ingin menghapus? (y/n): ').trim().toLowerCase();
  if (confirm !== 'y') {
    console.log(color('Penghapusan dibatalkan.', 'yellow'));
    return;
  }
  const ok = manager.removeStudent(id);
  if (ok) console.log(color('Siswa berhasil dihapus.', 'green'));
  else console.log(color('Siswa tidak ditemukan.', 'red'));
}

/**
 * Handler untuk menambah nilai siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data siswa
 * - Minta input mata pelajaran dan nilai
 * - Tambahkan nilai menggunakan method addGrade
 */
function addGradeToStudent() {
  console.log('\n' + color('--- Tambah Nilai Siswa ---', 'green'));
  const id = readlineSync.question('Masukkan ID siswa: ').trim();
  const s = manager.findStudent(id);
  if (!s) {
    console.log(color('Siswa tidak ditemukan.', 'red'));
    return;
  }
  s.displayInfo();
  const subject = readlineSync.question('Masukkan nama mata pelajaran: ').trim();
  const scoreStr = readlineSync.question('Masukkan nilai (0-100): ').trim();
  const score = Number(scoreStr);
  try {
    s.addGrade(subject, score);
    manager.saveToFile(); // persist change
    console.log(color('Nilai berhasil ditambahkan.', 'green'));
  } catch (err) {
    console.log(color('Error: ' + err.message, 'red'));
  }
}

/**
 * Handler untuk melihat top students
 * TODO: Implementasikan function ini
 * - Panggil getTopStudents(3) dari manager
 * - Tampilkan informasi siswa
 */
function viewTopStudents() {
  console.log('\n' + color('--- Top 3 Siswa ---', 'green'));
  const top = manager.getTopStudents(3);
  if (top.length === 0) {
    console.log(color('Belum ada siswa terdaftar.', 'yellow'));
    return;
  }
  top.forEach((s, i) => {
    console.log(color(`#${i+1} - ${s.name} (ID: ${s.id}) - Rata-rata: ${s.getAverage().toFixed(2)}`, 'blue'));
  });
}

/**
 * Handler filter by class (bonus)
 */
function filterByClass() {
  console.log('\n' + color('--- Filter by Kelas ---', 'green'));
  const kelas = readlineSync.question('Masukkan nama kelas (contoh: 10A): ').trim();
  const list = manager.getStudentsByClass(kelas);
  if (list.length === 0) {
    console.log(color(`Tidak ada siswa di kelas ${kelas}.`, 'yellow'));
    return;
  }
  list.forEach(s => {
    s.displayInfo();
    console.log('------------------------');
  });
}

/**
 * Handler class statistics (bonus)
 */
function classStatistics() {
  console.log('\n' + color('--- Statistik Kelas ---', 'green'));
  const kelas = readlineSync.question('Masukkan nama kelas (contoh: 10A): ').trim();
  const stats = manager.getClassStatistics(kelas);
  if (stats.totalStudents === 0) {
    console.log(color('Tidak ada data untuk kelas tersebut.', 'yellow'));
    return;
  }
  console.log(`Kelas: ${stats.className}`);
  console.log(`Total siswa: ${stats.totalStudents}`);
  console.log(`Rata-rata kelas: ${stats.averageClassScore.toFixed(2)}`);
  console.log(`Lulus: ${stats.passCount}`);
  console.log(`Tidak Lulus: ${stats.failCount}`);
}

/**
 * Handler export report (bonus)
 */
function exportReport() {
  console.log('\n' + color('--- Export Laporan ---', 'green'));
  const prefix = readlineSync.question('Masukkan prefix filename (default: report): ').trim() || 'report';
  try {
    const { jsonOut, csvOut } = manager.exportReport(prefix);
    console.log(color(`Export sukses: ${jsonOut} , ${csvOut}`, 'green'));
  } catch (err) {
    console.log(color('Error saat export: ' + err.message, 'red'));
  }
}

/**
 * Main program loop
 * TODO: Implementasikan main loop
 * - Tampilkan menu
 * - Baca input pilihan
 * - Panggil handler yang sesuai
 * - Ulangi sampai user pilih keluar
 */
function main() {
  console.log(color('Selamat datang di Sistem Manajemen Nilai Siswa!', 'yellow'));
  
  let running = true;
  
  while (running) {
    displayMenu();
    const choice = readlineSync.question('Pilih menu (1-11): ').trim();

    switch (choice) {
      case '1':
        addNewStudent();
        break;
      case '2':
        viewAllStudents();
        break;
      case '3':
        searchStudent();
        break;
      case '4':
        updateStudent();
        break;
      case '5':
        deleteStudent();
        break;
      case '6':
        addGradeToStudent();
        break;
      case '7':
        viewTopStudents();
        break;
      case '8':
        filterByClass();
        break;
      case '9':
        classStatistics();
        break;
      case '10':
        exportReport();
        break;
      case '11':
        running = false;
        break;
      default:
        console.log(color('Pilihan tidak valid!', 'red'));
    }
  }
  
  console.log('\n' + color('Terima kasih telah menggunakan aplikasi ini!', 'blue'));
}

// Jalankan aplikasi
main();
