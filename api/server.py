from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="高校拜访智能助手 API")

# 启用CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class SchoolInfo(BaseModel):
    name: str
    level: Optional[str] = None
    province: Optional[str] = None
    type: Optional[str] = None

class LeaderInfo(BaseModel):
    name: str
    title: str
    department: Optional[str] = None

class GoalInfo(BaseModel):
    type: str
    description: Optional[str] = None
    urgency: Optional[str] = "normal"

class VisitTask(BaseModel):
    school: SchoolInfo
    leader: LeaderInfo
    goal: GoalInfo

class ChatMessage(BaseModel):
    message: str
    context: dict

# 模拟数据 - 实际项目中应使用真实搜索API
def mock_search_school(school_name: str):
    """模拟搜索学校信息"""
    return {
        "level": "双一流",
        "type": "综合",
        "location": "北京市",
        "scale": "约50000人",
        "founding_year": "1911年"
    }

def mock_search_news(school_name: str):
    """模拟搜索学校新闻"""
    return [
        {
            "title": f"{school_name}推进智慧校园建设",
            "date": "2024-02-15",
            "source": "学校官网",
            "summary": "学校计划投资2亿元建设智慧校园，包括智能教室、数据中心等项目。"
        },
        {
            "title": f"{school_name}与科大讯飞签署战略合作协议",
            "date": "2023-11-20",
            "source": "中国教育报",
            "summary": "双方将在人工智能教育应用、智慧校园等领域展开深度合作。"
        },
        {
            "title": f"{school_name}成立人工智能学院",
            "date": "2023-09-01",
            "source": "科技日报",
            "summary": "新学院将聚焦AI基础研究和产业应用，计划招生500人。"
        }
    ]

def mock_search_it_status(school_name: str):
    """模拟搜索信息化现状"""
    return {
        "smartCampus": True,
        "partners": ["华为", "阿里云"],
        "systems": ["教务系统", "一卡通", "图书馆系统"],
        "budget": "年度IT预算约5000万"
    }

def mock_analyze_leader(leader_name: str, leader_title: str, school_name: str):
    """模拟分析领导信息"""
    return {
        "education": "博士，清华大学计算机专业",
        "research": "人工智能、教育信息化",
        "achievements": "发表SCI论文50余篇，主持国家级项目3项",
        "managementStyle": "该领导注重实效，偏好数据驱动的决策方式。对新技术持开放态度，但重视投入产出比。",
        "concerns": [
            "如何提升教学质量与效率",
            "教育信息化的投入产出比",
            "数据安全与隐私保护",
            "师生对新系统的接受度"
        ]
    }

def mock_generate_strategy(task: VisitTask, intelligence: dict, leader_profile: dict):
    """模拟生成拜访策略"""
    return {
        "opening": f"{task.leader.name}{task.leader.title}您好，我是科大讯飞高教业务的咨询顾问。了解到咱们{task.school.name}在智慧教育领域一直走在前列，特别是去年人工智能学院的成立，体现了学校对技术创新的重视。今天来拜访，主要是想汇报一下我们在AI+教育领域的最新进展，看看能否为学校的数字化建设提供更多支持。",
        
        "topics": [
            {
                "title": "智慧教学环境升级",
                "approach": "从现有智慧教室的使用情况切入，探讨如何通过AI技术进一步提升教学体验"
            },
            {
                "title": "AI课程体系建设",
                "approach": "结合学校新成立的人工智能学院，探讨产教融合的课程共建方案"
            },
            {
                "title": "数据治理与应用",
                "approach": "从现有数据孤岛问题切入，介绍教育大数据平台的建设方案"
            },
            {
                "title": "合作模式探讨",
                "approach": "根据领导关注点，提出灵活的合作模式（共建实验室、联合培养等）"
            }
        ],
        
        "valueProps": [
            {
                "title": "提升教学效率30%",
                "description": "通过AI助教、智能批改等功能，显著减轻教师负担"
            },
            {
                "title": "降低IT运维成本",
                "description": "统一平台整合现有系统，减少重复建设和维护成本"
            },
            {
                "title": "增强学校竞争力",
                "description": "打造智慧教育标杆，提升学校品牌影响力"
            },
            {
                "title": "数据资产沉淀",
                "description": "构建校级数据中台，实现数据价值最大化"
            }
        ],
        
        "objections": [
            {
                "question": "我们已经有了华为/阿里的系统，为什么还要用你们的？",
                "response": "我们的定位不是替代，而是补充和增强。特别是在AI+教育这个垂直领域，我们有更深入的积累。可以与现有系统无缝集成，保护学校已有投资。"
            },
            {
                "question": "预算比较紧张，这个项目需要多少钱？",
                "response": "我们提供灵活的付费模式，可以分期实施，先从一个学院或场景试点，见效后再扩展。具体方案我们可以根据学校的实际情况量身定制。"
            },
            {
                "question": "老师和学生能适应新系统吗？",
                "response": "我们有完善的培训体系和运营支持团队，并且产品设计注重用户体验，操作简单。同时提供过渡期并行运行，确保平稳切换。"
            }
        ],
        
        "nextSteps": [
            "邀请领导参观科大讯飞成功案例",
            "提供详细的技术方案书和报价",
            "安排产品演示，邀请相关老师参与",
            "确定下次沟通时间和参与人员"
        ]
    }

# API端点
@app.post("/api/gather-intelligence")
async def gather_intelligence(task: VisitTask):
    """搜集学校和领导情报"""
    try:
        school_info = mock_search_school(task.school.name)
        news = mock_search_news(task.school.name)
        it_status = mock_search_it_status(task.school.name)
        
        return {
            "school": school_info,
            "news": news,
            "it": it_status,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-leader")
async def analyze_leader(task: VisitTask):
    """分析领导画像"""
    try:
        profile = mock_analyze_leader(
            task.leader.name,
            task.leader.title,
            task.school.name
        )
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-strategy")
async def generate_strategy(task: VisitTask):
    """生成拜访策略"""
    try:
        # 获取情报和画像
        intelligence = await gather_intelligence(task)
        leader_profile = await analyze_leader(task)
        
        strategy = mock_generate_strategy(task, intelligence, leader_profile)
        return strategy
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simulation/start")
async def start_simulation(task: VisitTask):
    """开始模拟对话"""
    return {
        "message": f"你好，我是{task.leader.name}。听说你们是科大讯飞来的？请简单介绍一下今天来的目的。",
        "role": "leader"
    }

@app.post("/api/simulation/chat")
async def chat_simulation(chat: ChatMessage):
    """模拟对话"""
    user_message = chat.message
    context = chat.context
    
    # 简单的回复逻辑
    responses = [
        "这个方案听起来不错，但是我想了解一下具体的实施周期和成本。",
        "你们和其他厂商相比，核心优势是什么？",
        "我们之前也接触过类似的产品，但效果不太理想。你们有什么不一样的地方？",
        "这个方案对现有的教学秩序会有多大影响？",
        "我需要和相关部门再讨论一下，你能提供一个详细的方案书吗？"
    ]
    
    import random
    return {
        "message": random.choice(responses),
        "role": "leader"
    }

@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
