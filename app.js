document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentSubject = 'math';
    let currentTab = null;

    // DOM Elements
    const subjectBtns = document.querySelectorAll('.nav-item');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contentContainer = document.getElementById('dynamic-content');

    // Initialize - show first subject content
    loadSubjectContent();

    // Subject Button Listeners
    subjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            subjectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update state
            currentSubject = btn.dataset.subject;
            currentTab = null;

            // Reset tab buttons
            tabBtns.forEach(b => b.classList.remove('active'));

            // Load content
            loadSubjectContent();
        });
    });

    // Tab Button Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update state
            currentTab = btn.dataset.tab;

            // Deactivate subject buttons when tab is active
            subjectBtns.forEach(b => b.classList.remove('active'));

            // Load content
            loadTabContent();
        });
    });

    function loadSubjectContent() {
        const subjectData = courseData[currentSubject];

        if (!subjectData || !subjectData.topics || subjectData.topics.length === 0) {
            contentContainer.innerHTML = `
                <div style="text-align:center; padding: 3rem;">
                    <i class="fa-solid fa-person-digging" style="font-size: 3rem; color: #999; margin-bottom: 1rem;"></i>
                    <h3>Bu ders için içerik hazırlanıyor...</h3>
                    <p>Lütfen daha sonra tekrar kontrol edin.</p>
                </div>
            `;
            return;
        }

        const subjectNames = {
            'math': 'Matematik',
            'science': 'Fen Bilimleri',
            'turkish': 'Türkçe',
            'history': 'İnkılap Tarihi',
            'english': 'İngilizce',
            'religion': 'Din Kültürü'
        };

        let html = `
            <div class="subject-header">
                <h1><i class="${getSubjectIcon(currentSubject)}"></i> ${subjectNames[currentSubject]}</h1>
                <p>Toplam ${subjectData.topics.length} konu</p>
            </div>
            <div class="topics-grid">
        `;

        subjectData.topics.forEach((topic, index) => {
            const content = topic.content;
            html += `
                <div class="topic-card">
                    <h3>${topic.title}</h3>
                    
                    ${content.lecture ? `
                        <div class="topic-section">
                            <h4><i class="fa-solid fa-book"></i> Konu Anlatımı</h4>
                            <div class="topic-content">${content.lecture}</div>
                        </div>
                    ` : ''}
                    
                    ${content.summary ? `
                        <div class="topic-section">
                            <h4><i class="fa-solid fa-list"></i> Özet</h4>
                            <div class="topic-content">${content.summary}</div>
                        </div>
                    ` : ''}
                    
                    ${content.tips ? `
                        <div class="topic-section">
                            <h4><i class="fa-solid fa-lightbulb"></i> İpuçları</h4>
                            <div class="topic-content">${content.tips}</div>
                        </div>
                    ` : ''}
                    
                    ${content.mistakes ? `
                        <div class="topic-section">
                            <h4><i class="fa-solid fa-triangle-exclamation"></i> Dikkat Edilmesi Gerekenler</h4>
                            <div class="topic-content">${content.mistakes}</div>
                        </div>
                    ` : ''}
                    
                    ${content.questions && content.questions.length > 0 ? `
                        <div class="topic-section">
                            <h4><i class="fa-solid fa-pen-to-square"></i> Örnek Sorular (${content.questions.length} soru)</h4>
                            <button class="show-questions-btn" onclick="showTopicQuestions(${index})">
                                Soruları Göster
                            </button>
                            <div id="topic-questions-${index}" style="display:none; margin-top:1rem;">
                                ${renderTopicQuestions(content.questions, index)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += '</div>';
        contentContainer.innerHTML = html;
    }

    function renderTopicQuestions(questions, topicIndex) {
        let html = '';
        questions.forEach((q, qIndex) => {
            const uniqueId = `${topicIndex}-${qIndex}`;
            html += `
                <div class="question-card" id="q-${uniqueId}" style="margin-top:1rem;">
                    <div class="question-header">
                        <span>Soru ${qIndex + 1}</span>
                    </div>
                    ${q.image ? `<img src="${q.image}" class="question-image" alt="Soru görseli">` : ''}
                    <div class="question-text">${q.text}</div>
                    <div class="options-grid">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn" onclick="checkAnswer('${uniqueId}', ${i}, ${q.correct}, this)">
                                ${String.fromCharCode(65 + i)}) ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div class="feedback-area" id="feedback-${uniqueId}" style="margin-top:1rem; display:none;"></div>
                </div>
            `;
        });
        return html;
    }

    window.showTopicQuestions = function (topicIndex) {
        const questionsDiv = document.getElementById(`topic-questions-${topicIndex}`);
        if (questionsDiv.style.display === 'none') {
            questionsDiv.style.display = 'block';
        } else {
            questionsDiv.style.display = 'none';
        }
    };

    function loadTabContent() {
        if (currentTab === 'mistakes') {
            loadMistakesContent();
        } else if (currentTab === 'questions') {
            loadQuestionsContent();
        } else if (currentTab === 'game') {
            loadGameContent();
        }
    }

    function loadMistakesContent() {
        let html = `
            <div class="subject-header">
                <h1><i class="fa-solid fa-triangle-exclamation"></i> Dikkat Edilmesi Gerekenler</h1>
                <p>Tüm derslerden önemli hatırlatmalar</p>
            </div>
        `;

        Object.keys(courseData).forEach(subject => {
            const subjectData = courseData[subject];
            if (subjectData.topics) {
                subjectData.topics.forEach(topic => {
                    if (topic.content.mistakes) {
                        html += `
                            <div class="topic-card">
                                <h3>${topic.title}</h3>
                                ${topic.content.mistakes}
                            </div>
                        `;
                    }
                });
            }
        });

        contentContainer.innerHTML = html;
    }

    function loadQuestionsContent() {
        let html = `
            <div class="subject-header">
                <h1><i class="fa-solid fa-pen-to-square"></i> Soru Bankası</h1>
                <p>Tüm konulardan sorular</p>
            </div>
        `;

        let questionCount = 0;
        Object.keys(courseData).forEach(subject => {
            const subjectData = courseData[subject];
            if (subjectData.topics) {
                subjectData.topics.forEach(topic => {
                    if (topic.content.questions && topic.content.questions.length > 0) {
                        topic.content.questions.forEach((q, index) => {
                            questionCount++;
                            const uniqueId = `all-${questionCount}`;
                            html += `
                                <div class="question-card" id="q-${uniqueId}">
                                    <div class="question-header">
                                        <span>Soru ${questionCount}</span>
                                        <span class="topic-badge">${topic.title}</span>
                                    </div>
                                    ${q.image ? `<img src="${q.image}" class="question-image" alt="Soru görseli">` : ''}
                                    <div class="question-text">${q.text}</div>
                                    <div class="options-grid">
                                        ${q.options.map((opt, i) => `
                                            <button class="option-btn" onclick="checkAnswer('${uniqueId}', ${i}, ${q.correct}, this)">
                                                ${String.fromCharCode(65 + i)}) ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                    <div class="feedback-area" id="feedback-${uniqueId}" style="margin-top:1rem; display:none;"></div>
                                </div>
                            `;
                        });
                    }
                });
            }
        });

        if (questionCount === 0) {
            html += '<p>Henüz soru eklenmemiş.</p>';
        }

        contentContainer.innerHTML = html;
    }

    function loadGameContent() {
        contentContainer.innerHTML = `
            <div class="subject-header">
                <h1><i class="fa-solid fa-gamepad"></i> Eğitici Oyunlar</h1>
                <p>Oyunlar yakında eklenecek...</p>
            </div>
        `;
    }

    function getSubjectIcon(subject) {
        const icons = {
            'math': 'fa-solid fa-calculator',
            'science': 'fa-solid fa-flask',
            'turkish': 'fa-solid fa-book-open',
            'history': 'fa-solid fa-landmark',
            'english': 'fa-solid fa-language',
            'religion': 'fa-solid fa-mosque'
        };
        return icons[subject] || 'fa-solid fa-book';
    }

    // Global function for onclick
    window.checkAnswer = function (qId, selectedIndex, correctIndex, btnElement) {
        const card = document.getElementById(`q-${qId}`);
        const buttons = card.querySelectorAll('.option-btn');
        const feedback = document.getElementById(`feedback-${qId}`);

        // Disable all buttons in this card
        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === correctIndex) {
            btnElement.classList.add('correct');
            feedback.innerHTML = '<div class="tip-box" style="margin:0; background:#dcfce7; color:#166534;"><i class="fa-solid fa-check"></i> Tebrikler! Doğru Cevap.</div>';
        } else {
            btnElement.classList.add('wrong');
            buttons[correctIndex].classList.add('correct');
            feedback.innerHTML = '<div class="warning-box" style="margin:0; background:#ffe4e6; color:#9f1239;"><i class="fa-solid fa-xmark"></i> Yanlış Cevap. Doğru seçenek işaretlendi.</div>';
        }
        feedback.style.display = 'block';
    };
});
