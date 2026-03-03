const API_BASE_URL = 'http://localhost:8000';

// 全局状态
let currentTask = {
    school: {},
    leader: {},
    intelligence: {},
    strategy: {}
};

// 步骤管理
let currentStep = 1;
const totalSteps = 5;

function init() {
    showStep(1);
    bindEvents();
}

function bindEvents() {
    document.getElementById('visitForm').addEventListener('submit', handleFormSubmit);
}

function showStep(step) {
    // 隐藏所有步骤
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.add('hidden');
    });
    
    // 显示当前步骤
    document.getElementById(`step-${step}`).classList.remove('hidden');
    
    // 更新步骤指示器
    updateStepIndicator(step);
    currentStep = step;
}

function updateStepIndicator(step) {
    for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.querySelector(`[data-step="${i}"] div`);
        const lineEl = document.getElementById(`line-${i}`);
        
        if (i <= step) {
            stepEl.classList.remove('bg-gray-300');
            stepEl.classList.add('gradient-bg');
            if (lineEl) {
                lineEl.classList.remove('bg-gray-300');
                lineEl.classList.add('bg-indigo-500');
            }
        } else {
            stepEl.classList.add('bg-gray-300');
            stepEl.classList.remove('gradient-bg');
            if (lineEl) {
                lineEl.classList.add('bg-gray-300');
                lineEl.classList.remove('bg-indigo-500');
            }
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // 收集表单数据
    currentTask.school = {
        name: document.getElementById('schoolName').value,
        level: document.getElementById('schoolLevel').value,
        province: document.getElementById('province').value,
        type: document.getElementById('schoolType').value
    };
    
    currentTask.leader = {
        name: document.getElementById('leaderName').value,
        title: document.getElementById('leaderTitle').value,
        department: document.getElementById('leaderDept').value
    };
    
    currentTask.goal = {
        type: document.getElementById('visitGoal').value,
        description: document.getElementById('goalDetail').value,
        urgency: document.getElementById('urgency').value
    };
    
    // 进入步骤2：情报搜集
    showStep(2);
    await gatherIntelligence();
}

async function gatherIntelligence() {
    const loadingEl = document.getElementById('intelligence-loading');
    const resultEl = document.getElementById('intelligence-result');
    
    loadingEl.classList.remove('hidden');
    resultEl.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/gather-intelligence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentTask)
        });
        
        const data = await response.json();
        currentTask.intelligence = data;
        
        renderIntelligence(data);
        loadingEl.classList.add('hidden');
        resultEl.classList.remove('hidden');
        
    } catch (error) {
        console.error('情报搜集失败:', error);
        alert('情报搜集失败，请稍后重试');
    }
}

function renderIntelligence(data) {
    // 渲染学校概况
    const schoolOverview = document.getElementById('school-overview');
    schoolOverview.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">学校层次</div>
                <div class="font-semibold">${data.school.level || '未知'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">学校类型</div>
                <div class="font-semibold">${data.school.type || '未知'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">在校生规模</div>
                <div class="font-semibold">${data.school.scale || '未知'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">地理位置</div>
                <div class="font-semibold">${data.school.location || '未知'}</div>
            </div>
        </div>
    `;
    
    // 渲染近期动态
    const newsContainer = document.getElementById('school-news');
    newsContainer.innerHTML = data.news.map(item => `
        <div class="border-l-4 border-indigo-500 pl-4 py-2">
            <div class="font-medium text-gray-800">${item.title}</div>
            <div class="text-sm text-gray-500 mt-1">${item.date} · ${item.source}</div>
            <div class="text-sm text-gray-600 mt-1">${item.summary}</div>
        </div>
    `).join('');
    
    // 渲染信息化现状
    const itContainer = document.getElementById('school-it');
    itContainer.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>智慧校园建设</span>
                <span class="px-2 py-1 rounded text-sm ${data.it.smartCampus ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                    ${data.it.smartCampus ? '已建设' : '未建设'}
                </span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>现有合作伙伴</span>
                <span class="text-sm text-gray-600">${data.it.partners?.join(', ') || '暂无'}</span>
            </div>
        </div>
    `;
}

function goToStep3() {
    showStep(3);
    analyzeLeader();
}

async function analyzeLeader() {
    const loadingEl = document.getElementById('leader-loading');
    const resultEl = document.getElementById('leader-result');
    
    loadingEl.classList.remove('hidden');
    resultEl.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze-leader`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentTask)
        });
        
        const data = await response.json();
        currentTask.leaderProfile = data;
        
        renderLeaderProfile(data);
        loadingEl.classList.add('hidden');
        resultEl.classList.remove('hidden');
        
    } catch (error) {
        console.error('领导画像分析失败:', error);
    }
}

function renderLeaderProfile(data) {
    document.getElementById('leader-basic').innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-2xl text-indigo-600"></i>
            </div>
            <div>
                <h3 class="text-xl font-bold">${currentTask.leader.name}</h3>
                <p class="text-gray-600">${currentTask.leader.title}</p>
                <p class="text-sm text-gray-500">${currentTask.leader.department}</p>
            </div>
        </div>
    `;
    
    document.getElementById('leader-background').innerHTML = `
        <div class="space-y-2">
            <p><strong>学历背景：</strong>${data.education || '暂无信息'}</p>
            <p><strong>研究方向：</strong>${data.research || '暂无信息'}</p>
            <p><strong>学术成果：</strong>${data.achievements || '暂无信息'}</p>
        </div>
    `;
    
    document.getElementById('leader-style').innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 class="font-semibold text-amber-800 mb-2">管理风格分析</h4>
            <p class="text-amber-700">${data.managementStyle || '暂无分析'}</p>
        </div>
    `;
    
    document.getElementById('leader-concerns').innerHTML = `
        <div class="space-y-2">
            ${(data.concerns || []).map(c => `
                <div class="flex items-center">
                    <i class="fas fa-circle text-indigo-500 text-xs mr-2"></i>
                    <span>${c}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function goToStep4() {
    showStep(4);
    generateStrategy();
}

async function generateStrategy() {
    const loadingEl = document.getElementById('strategy-loading');
    const resultEl = document.getElementById('strategy-result');
    
    loadingEl.classList.remove('hidden');
    resultEl.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-strategy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentTask)
        });
        
        const data = await response.json();
        currentTask.strategy = data;
        
        renderStrategy(data);
        loadingEl.classList.add('hidden');
        resultEl.classList.remove('hidden');
        
    } catch (error) {
        console.error('策略生成失败:', error);
    }
}

function renderStrategy(data) {
    // 开场白
    document.getElementById('strategy-opening').innerHTML = `
        <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p class="text-indigo-900 leading-relaxed">${data.opening}</p>
        </div>
    `;
    
    // 话题路径
    document.getElementById('strategy-topics').innerHTML = `
        <div class="space-y-3">
            ${data.topics.map((t, i) => `
                <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        ${i + 1}
                    </div>
                    <div>
                        <div class="font-medium">${t.title}</div>
                        <div class="text-sm text-gray-600">${t.approach}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // 价值呈现
    document.getElementById('strategy-value').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.valueProps.map(v => `
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="font-semibold text-green-800">${v.title}</div>
                    <div class="text-sm text-green-700 mt-1">${v.description}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // 异议应对
    document.getElementById('strategy-objections').innerHTML = `
        <div class="space-y-3">
            ${data.objections.map(o => `
                <div class="border rounded-lg p-4">
                    <div class="font-medium text-red-600 mb-2">
                        <i class="fas fa-exclamation-circle mr-1"></i>${o.question}
                    </div>
                    <div class="text-gray-700 bg-gray-50 p-3 rounded">${o.response}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // 下一步行动
    document.getElementById('strategy-next').innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">建议下一步行动</h4>
            <ul class="space-y-2">
                ${data.nextSteps.map(s => `
                    <li class="flex items-start">
                        <i class="fas fa-check-circle text-blue-500 mr-2 mt-1"></i>
                        <span class="text-blue-900">${s}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function goToStep5() {
    showStep(5);
    initSimulation();
}

function initSimulation() {
    const chatContainer = document.getElementById('simulation-chat');
    chatContainer.innerHTML = `
        <div class="text-center text-gray-500 py-8">
            <i class="fas fa-robot text-4xl mb-3"></i>
            <p>点击"开始模拟"，AI将扮演${currentTask.leader.name}与您对话</p>
        </div>
    `;
}

async function startSimulation() {
    const chatContainer = document.getElementById('simulation-chat');
    
    // 初始化对话
    const response = await fetch(`${API_BASE_URL}/api/simulation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTask)
    });
    
    const data = await response.json();
    
    chatContainer.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-start">
                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-user-tie text-indigo-600"></i>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 max-w-3xl">
                    <div class="font-medium text-sm text-gray-600 mb-1">${currentTask.leader.name}</div>
                    <div>${data.message}</div>
                </div>
            </div>
        </div>
    `;
}

async function sendSimulationMessage() {
    const input = document.getElementById('simulation-input');
    const message = input.value.trim();
    if (!message) return;
    
    const chatContainer = document.getElementById('simulation-chat');
    
    // 添加用户消息
    chatContainer.innerHTML += `
        <div class="flex items-start justify-end">
            <div class="bg-indigo-500 text-white rounded-lg p-3 max-w-3xl mr-3">
                ${message}
            </div>
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-gray-600"></i>
            </div>
        </div>
    `;
    
    input.value = '';
    
    // 获取AI回复
    const response = await fetch(`${API_BASE_URL}/api/simulation/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context: currentTask })
    });
    
    const data = await response.json();
    
    chatContainer.innerHTML += `
        <div class="flex items-start">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-user-tie text-indigo-600"></i>
            </div>
            <div class="bg-gray-100 rounded-lg p-3 max-w-3xl">
                <div class="font-medium text-sm text-gray-600 mb-1">${currentTask.leader.name}</div>
                <div>${data.message}</div>
            </div>
        </div>
    `;
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showHistory() {
    alert('历史记录功能开发中...');
}

function exportReport() {
    const report = generateReportText();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `拜访准备-${currentTask.school.name}-${currentTask.leader.name}.md`;
    a.click();
}

function generateReportText() {
    return `# 高校拜访准备报告

## 基本信息
- **学校**：${currentTask.school.name}
- **拜访对象**：${currentTask.leader.name} (${currentTask.leader.title})
- **拜访目标**：${currentTask.goal.type}
- **生成时间**：${new Date().toLocaleString()}

## 学校情报
${JSON.stringify(currentTask.intelligence, null, 2)}

## 领导画像
${JSON.stringify(currentTask.leaderProfile, null, 2)}

## 拜访策略
${JSON.stringify(currentTask.strategy, null, 2)}

---
*本报告由高校拜访智能助手生成*
`;
}

// 初始化
document.addEventListener('DOMContentLoaded', init);
