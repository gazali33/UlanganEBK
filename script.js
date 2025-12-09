// Data token valid
const validTokens = ["EBK2023", "KONSTRUKSI", "XI2023", "DPIB123"];

// Data siswa
const students = [
    "Ahmad Luthfi Zulfikar",
    "Anjanitha",
    "Aufa Barraq Yauqi Gunawan",
    "Daffa Ahmad Zaki",
    "Dimas Setiawan",
    "Ihsan Syariif Maulana Purwanto",
    "Mahmud Ahmadinejad",
    "Muhammad Nazril Al-Maheza",
    "Muhammad Raihan Zain",
    "Nadya Ayu Putri",
    "Natasya Fardela",
    "Nur Aulia",
    "Riana",
    "Riski Aditiya Pratama",
    "Sintiya Bella"
];

// Bank soal (40 soal)
const questionBank = [
    {
        question: "Estimasi biaya konstruksi adalah …",
        options: [
            "Proses perencanaan desain bangunan",
            "Perkiraan biaya yang dibutuhkan untuk menyelesaikan suatu proyek",
            "Pengawasan terhadap jalannya proyek",
            "Penilaian kualitas bahan",
            "Pelaksanaan pekerjaan di lapangan"
        ],
        correctAnswer: 1
    },
    // ... tambahkan semua soal lainnya di sini
];

// Variabel global
let currentStudent = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval;
let timeRemaining = 25 * 60; // 25 menit dalam detik

// DOM Elements
const tokenPage = document.getElementById('tokenPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const tokenInput = document.getElementById('tokenInput');
const tokenValidation = document.getElementById('tokenValidation');
const studentSelect = document.getElementById('studentSelect');
const accessBtn = document.getElementById('accessBtn');
const timer = document.getElementById('timer');
const submitBtn = document.getElementById('submitBtn');
const questionContainer = document.getElementById('questionContainer');
const currentQuestionSpan = document.getElementById('currentQuestion');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const questionNumbers = document.getElementById('questionNumbers');
const scoreValue = document.getElementById('scoreValue');
const studentName = document.getElementById('studentName');
const shareBtn = document.getElementById('shareBtn');
const retryBtn = document.getElementById('retryBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    accessBtn.addEventListener('click', validateToken);
    submitBtn.addEventListener('click', submitQuiz);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    shareBtn.addEventListener('click', shareResult);
    retryBtn.addEventListener('click', retryQuiz);
});

// Validasi token
function validateToken() {
    const token = tokenInput.value.trim();
    const student = studentSelect.value;
    
    if (!token) {
        tokenValidation.style.display = 'block';
        tokenValidation.textContent = 'Token harus diisi';
        return;
    }
    
    if (!student) {
        tokenValidation.style.display = 'block';
        tokenValidation.textContent = 'Pilih nama siswa terlebih dahulu';
        return;
    }
    
    if (validTokens.includes(token.toUpperCase())) {
        currentStudent = student;
        startQuiz();
    } else {
        tokenValidation.style.display = 'block';
        tokenValidation.textContent = 'Token tidak valid. Silakan coba lagi.';
    }
}

// Memulai kuis
function startQuiz() {
    // Reset variabel
    currentQuestionIndex = 0;
    userAnswers = new Array(30).fill(-1);
    timeRemaining = 25 * 60;
    
    // Acak soal
    currentQuestions = getRandomQuestions(30);
    
    // Tampilkan halaman soal
    tokenPage.classList.remove('active');
    questionPage.classList.add('active');
    
    // Render navigasi soal
    renderQuestionNumbers();
    
    // Tampilkan soal pertama
    showQuestion(0);
    
    // Mulai timer
    startTimer();
}

// Mendapatkan soal acak
function getRandomQuestions(count) {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Render nomor soal
function renderQuestionNumbers() {
    questionNumbers.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'question-number';
        numberDiv.textContent = i + 1;
        numberDiv.addEventListener('click', () => showQuestion(i));
        questionNumbers.appendChild(numberDiv);
    }
}

// Menampilkan soal
function showQuestion(index) {
    currentQuestionIndex = index;
    const question = currentQuestions[index];
    
    // Update progress
    currentQuestionSpan.textContent = index + 1;
    
    // Update tombol navigasi
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === 29;
    
    // Update highlight nomor soal
    document.querySelectorAll('.question-number').forEach((el, i) => {
        el.classList.remove('active');
        if (i === index) {
            el.classList.add('active');
        }
        if (userAnswers[i] !== -1) {
            el.classList.add('answered');
        } else {
            el.classList.remove('answered');
        }
    });
    
    // Render soal
    questionContainer.innerHTML = `
        <h5>${question.question}</h5>
        <div class="mt-3">
            ${question.options.map((option, i) => `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="answer" id="option${i}" value="${i}" ${userAnswers[index] === i ? 'checked' : ''}>
                    <label class="form-check-label" for="option${i}">
                        ${option}
                    </label>
                </div>
            `).join('')}
        </div>
    `;
    
    // Tambahkan event listener untuk pilihan jawaban
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', function() {
            userAnswers[index] = parseInt(this.value);
            updateQuestionNumbers();
        });
    });
}

// Update status nomor soal
function updateQuestionNumbers() {
    document.querySelectorAll('.question-number').forEach((el, i) => {
        if (userAnswers[i] !== -1) {
            el.classList.add('answered');
        } else {
            el.classList.remove('answered');
        }
    });
}

// Menampilkan soal sebelumnya
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

// Menampilkan soal berikutnya
function showNextQuestion() {
    if (currentQuestionIndex < 29) {
        showQuestion(currentQuestionIndex + 1);
    }
}

// Memulai timer
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

// Update tampilan timer
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Ubah warna timer jika kurang dari 5 menit
    if (timeRemaining <= 5 * 60) {
        timer.style.color = 'var(--danger-color)';
    }
}

// Submit kuis
function submitQuiz() {
    clearInterval(timerInterval);
    
    // Hitung nilai
    let correctAnswers = 0;
    for (let i = 0; i < 30; i++) {
        if (userAnswers[i] === currentQuestions[i].correctAnswer) {
            correctAnswers++;
        }
    }
    
    const score = Math.round((correctAnswers / 30) * 100);
    
    // Simpan hasil ke Google Sheets
    saveResultToGoogleSheet(currentStudent, score);
    
    // Tampilkan halaman hasil
    questionPage.classList.remove('active');
    resultPage.classList.add('active');
    
    // Tampilkan hasil
    scoreValue.textContent = score;
    studentName.textContent = currentStudent;
}

// Simpan hasil ke Google Sheets
function saveResultToGoogleSheet(studentName, score) {
    // Ganti URL_GOOGLE_APPS_SCRIPT dengan URL dari Google Apps Script Anda
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyErQPlncI4_1WgUbwW79MsevC-8ezp4w11W95M5lYTNwrbHCoYxjrMwBuUkdHQVDBo/exec';
    
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nama: studentName,
            kelas: 'XI DPIB',
            nilai: score,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Share hasil
function shareResult() {
    const score = scoreValue.textContent;
    const text = `Saya ${currentStudent} dari kelas XI DPIB telah menyelesaikan tes Estimasi Biaya Konstruksi dengan nilai ${score}.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Hasil Tes Estimasi Biaya Konstruksi',
            text: text
        });
    } else {
        // Fallback untuk browser yang tidak mendukung Web Share API
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        alert('Teks telah disalin ke clipboard. Anda bisa menempelkannya di mana saja.');
    }
}

// Ulangi tes
function retryQuiz() {
    resultPage.classList.remove('active');
    tokenPage.classList.add('active');
    
    // Reset form
    tokenInput.value = '';
    studentSelect.value = '';
    tokenValidation.style.display = 'none';
}
