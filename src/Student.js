/**
 * Class Student
 * Representasi dari seorang siswa dengan data dan nilai-nilainya
 * 
 * TODO: Implementasikan class Student dengan:
 * - Constructor untuk inisialisasi properti (id, name, class, grades)
 * - Method addGrade(subject, score) untuk menambah nilai mata pelajaran
 * - Method getAverage() untuk menghitung rata-rata nilai
 * - Method getGradeStatus() untuk menentukan status Lulus/Tidak Lulus
 * - Method displayInfo() untuk menampilkan informasi siswa
 * 
 * Kriteria Lulus: rata-rata >= 75
 */

class Student {
  // TODO: Implementasikan constructor
  // Properti yang dibutuhkan:
  // - id: ID unik siswa
  // - name: Nama siswa
  // - class: Kelas siswa
  // - grades: Object untuk menyimpan nilai {subject: score}
  
  constructor(id, name, studentClass) {
    // Implementasi constructor di sini
    if (id === undefined || id === null || String(id).trim() === '') {
      throw new Error('ID tidak boleh kosong');
    }
    if (!name || String(name).trim() === '') {
      throw new Error('Nama tidak boleh kosong');
    }
    if (!studentClass || String(studentClass).trim() === '') {
      throw new Error('Kelas tidak boleh kosong');
    }

    this.id = String(id).trim();
    this.name = String(name).trim();
    this.class = String(studentClass).trim();
    this.grades = {}; // { subject: score }
  }

  /**
   * Menambah atau update nilai mata pelajaran
   * @param {string} subject - Nama mata pelajaran
   * @param {number} score - Nilai (0-100)
   * TODO: Validasi bahwa score harus antara 0-100
   */
  addGrade(subject, score) {
    // Implementasi method di sini
    if (!subject || String(subject).trim() === '') {
      throw new Error('Nama mata pelajaran tidak boleh kosong');
    }
    const num = Number(score);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      throw new Error('Nilai harus angka antara 0 sampai 100');
    }
    this.grades[String(subject).trim()] = num;
  }

  /**
   * Menghitung rata-rata nilai dari semua mata pelajaran
   * @returns {number} Rata-rata nilai
   * TODO: Hitung total nilai dibagi jumlah mata pelajaran
   */
  getAverage() {
    // Implementasi method di sini
    const keys = Object.keys(this.grades);
    if (keys.length === 0) return 0;
    const total = keys.reduce((acc, k) => acc + this.grades[k], 0);
    return total / keys.length;
  }

  /**
   * Menentukan status kelulusan siswa
   * @returns {string} "Lulus" atau "Tidak Lulus"
   * TODO: Return "Lulus" jika rata-rata >= 75, selain itu "Tidak Lulus"
   */
  getGradeStatus() {
    // Implementasi method di sini
    return this.getAverage() >= 75 ? 'Lulus' : 'Tidak Lulus';
  }

  /**
   * Menampilkan informasi lengkap siswa
   * TODO: Tampilkan ID, Nama, Kelas, semua nilai, rata-rata, dan status
   */
  displayInfo() {
    // Implementasi method di sini
    console.log(`ID       : ${this.id}`);
    console.log(`Nama     : ${this.name}`);
    console.log(`Kelas    : ${this.class}`);
    console.log('Mata Pelajaran:');
    const keys = Object.keys(this.grades);
    if (keys.length === 0) {
      console.log('  - (Belum ada nilai)');
    } else {
      keys.forEach(sub => {
        console.log(`  - ${sub}: ${this.grades[sub]}`);
      });
    }
    console.log(`Rata-rata: ${this.getAverage().toFixed(2)}`);
    console.log(`Status   : ${this.getGradeStatus()}`);
  }

  // Helper untuk persistence
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      class: this.class,
      grades: this.grades
    };
  }

  static fromJSON(obj) {
    const s = new Student(obj.id, obj.name, obj.class);
    if (obj.grades && typeof obj.grades === 'object') {
      for (const [sub, score] of Object.entries(obj.grades)) {
        // use addGrade to validate
        s.addGrade(sub, score);
      }
    }
    return s;
  }
}

export default Student;
