/**
 * Class StudentManager
 * Mengelola koleksi siswa dan operasi-operasi terkait
 * 
 * TODO: Implementasikan class StudentManager dengan:
 * - Constructor untuk inisialisasi array students
 * - Method addStudent(student) untuk menambah siswa
 * - Method removeStudent(id) untuk menghapus siswa
 * - Method findStudent(id) untuk mencari siswa
 * - Method updateStudent(id, data) untuk update data siswa
 * - Method getAllStudents() untuk mendapatkan semua siswa
 * - Method getTopStudents(n) untuk mendapatkan top n siswa
 * - Method displayAllStudents() untuk menampilkan semua siswa
 */

import fs from 'fs';
import path from 'path';
import Student from './Student.js';

class StudentManager {
  // TODO: Implementasikan constructor
  // Properti yang dibutuhkan:
  // - students: Array untuk menyimpan semua siswa
  
  constructor(dataFile = 'students.json') {
    // Implementasi constructor di sini
    this.students = [];
    this.dataFilePath = path.resolve(dataFile);
    this.loadFromFile();
  }

  // persistence helpers
  saveToFile() {
    try {
      const arr = this.students.map(s => s.toJSON());
      fs.writeFileSync(this.dataFilePath, JSON.stringify(arr, null, 2), 'utf8');
    } catch (err) {
      console.error('Gagal menyimpan data:', err.message);
    }
  }

  loadFromFile() {
    try {
      if (!fs.existsSync(this.dataFilePath)) {
        fs.writeFileSync(this.dataFilePath, '[]', 'utf8');
      }
      const raw = fs.readFileSync(this.dataFilePath, 'utf8');
      const arr = JSON.parse(raw || '[]');
      this.students = arr.map(obj => Student.fromJSON(obj));
    } catch (err) {
      console.error('Gagal memuat data:', err.message);
      this.students = [];
    }
  }

  /**
   * Menambah siswa baru ke dalam sistem
   * @param {Student} student - Object Student yang akan ditambahkan
   * @returns {boolean} true jika berhasil, false jika ID sudah ada
   * TODO: Validasi bahwa ID belum digunakan
   */
  addStudent(student) {
    // Implementasi method di sini
    const exists = this.students.some(s => s.id === student.id);
    if (exists) return false;
    this.students.push(student);
    this.saveToFile();
    return true;
  }

  /**
   * Menghapus siswa berdasarkan ID
   * @param {string} id - ID siswa yang akan dihapus
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * TODO: Cari dan hapus siswa dari array
   */
  removeStudent(id) {
    // Implementasi method di sini
    const idx = this.students.findIndex(s => s.id === String(id));
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    this.saveToFile();
    return true;
  }

  /**
   * Mencari siswa berdasarkan ID
   * @param {string} id - ID siswa yang dicari
   * @returns {Student|null} Object Student jika ditemukan, null jika tidak
   * TODO: Gunakan method array untuk mencari siswa
   */
  findStudent(id) {
    // Implementasi method di sini
    return this.students.find(s => s.id === String(id)) || null;
  }

  /**
   * Update data siswa
   * @param {string} id - ID siswa yang akan diupdate
   * @param {object} data - Data baru (name, class, dll)
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * TODO: Cari siswa dan update propertinya
   */
  updateStudent(id, data) {
    // Implementasi method di sini
    const s = this.findStudent(id);
    if (!s) return false;
    if (data.name !== undefined && String(data.name).trim() !== '') s.name = String(data.name).trim();
    if (data.class !== undefined && String(data.class).trim() !== '') s.class = String(data.class).trim();
    if (data.grades && typeof data.grades === 'object') {
      // replace grades
      s.grades = {};
      for (const [sub, score] of Object.entries(data.grades)) {
        s.addGrade(sub, score);
      }
    }
    this.saveToFile();
    return true;
  }

  /**
   * Mendapatkan semua siswa
   * @returns {Array} Array berisi semua siswa
   */
  getAllStudents() {
    // Implementasi method di sini
    return [...this.students];
  }

  /**
   * Mendapatkan top n siswa berdasarkan rata-rata nilai
   * @param {number} n - Jumlah siswa yang ingin didapatkan
   * @returns {Array} Array berisi top n siswa
   * TODO: Sort siswa berdasarkan rata-rata (descending) dan ambil n teratas
   */
  getTopStudents(n) {
    // Implementasi method di sini
    return [...this.students].sort((a,b) => b.getAverage() - a.getAverage()).slice(0, n);
  }

  /**
   * Menampilkan informasi semua siswa
   * TODO: Loop semua siswa dan panggil displayInfo() untuk masing-masing
   */
  displayAllStudents() {
    // Implementasi method di sini
    if (this.students.length === 0) {
      console.log('Belum ada siswa terdaftar.');
      return;
    }
    this.students.forEach(s => {
      s.displayInfo();
      console.log('------------------------');
    });
  }

  /**
   * BONUS: Mendapatkan siswa berdasarkan kelas
   * @param {string} className - Nama kelas
   * @returns {Array} Array siswa dalam kelas tersebut
   */
  getStudentsByClass(className) {
    // Implementasi method di sini (BONUS)
    return this.students.filter(s => s.class === className);
  }

  /**
   * BONUS: Mendapatkan statistik kelas
   * @param {string} className - Nama kelas
   * @returns {object} Object berisi statistik (jumlah siswa, rata-rata kelas, dll)
   */
  getClassStatistics(className) {
    // Implementasi method di sini (BONUS)
    const list = this.getStudentsByClass(className);
    if (list.length === 0) {
      return {
        className,
        totalStudents: 0,
        averageClassScore: 0,
        passCount: 0,
        failCount: 0
      };
    }
    const totalAvg = list.reduce((acc, s) => acc + s.getAverage(), 0);
    const passCount = list.filter(s => s.getAverage() >= 75).length;
    return {
      className,
      totalStudents: list.length,
      averageClassScore: totalAvg / list.length,
      passCount,
      failCount: list.length - passCount
    };
  }

  /**
   * Export report to files (JSON and CSV)
   * @param {string} outPrefix - prefix nama file (without ext)
   */
  exportReport(outPrefix = 'report') {
    const jsonOut = `${outPrefix}.json`;
    const csvOut = `${outPrefix}.csv`;
    try {
      const arr = this.students.map(s => s.toJSON());
      fs.writeFileSync(jsonOut, JSON.stringify(arr, null, 2), 'utf8');

      // CSV: id,name,class,avg,status,subjects (semi-colon separated subject:score)
      const lines = [];
      lines.push('id,name,class,average,status,subjects');
      for (const s of this.students) {
        const subj = Object.entries(s.grades).map(([k,v]) => `${k}:${v}`).join(';');
        lines.push(`"${s.id}","${s.name}","${s.class}",${s.getAverage().toFixed(2)},"${s.getGradeStatus()}","${subj}"`);
      }
      fs.writeFileSync(csvOut, lines.join('\n'), 'utf8');

      return { jsonOut, csvOut };
    } catch (err) {
      throw new Error('Gagal export report: ' + err.message);
    }
  }
}

export default StudentManager;
