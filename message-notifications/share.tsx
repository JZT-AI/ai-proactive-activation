



// Consolidated Imports
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { Archive, ArrowUp, AtSign, Bot, Check, CheckCircle2, ChevronDown, ChevronRight, ChevronLeft, Circle, Clock, Copy, FileText, Filter, History, Image as ImageIcon, ListFilter, Loader2, Mail, MessageSquare, Moon, MoreHorizontal, Pencil, Pin, Play, Plus, RefreshCw, Search, Send, Slash, Smile, Square, User, UserPlus, Users, X, Zap, Workflow, LineChart, UserCircle, FolderPlus, Eye, Trash2, PanelLeftOpen, AlertCircle, Megaphone, Tag, Settings, LayoutGrid, Command, Image, FolderOpen, Flame, Heart, MessageCircle, Share2, ExternalLink, Compass, Smartphone, Bell, Radio, Volume2, Link as LinkIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// --- Analytics Hook (埋点统计工具) ---
const useAnalytics = () => {
  // 模拟发送埋点数据
  const sendToAnalytics = useCallback((eventName: string, data: any = {}) => {
    // 1. 打印日志方便调试
    console.log(`[Analytics] ${eventName}`, data);

    // 2. 如果接入了第三方统计（如百度统计），可以在这里调用
    if (window._hmt) {
      // 百度统计事件追踪格式: _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
      // 这里我们将 eventName 作为 action, data 转为 string 作为 label
      window._hmt.push(['_trackEvent', 'interaction', eventName, JSON.stringify(data)]);
    }

    // 3. 如果有后端接口，可以在这里发送请求
    // fetch('/api/log', {
    //   method: 'POST',
    //   body: JSON.stringify({ event: eventName, ...data, timestamp: Date.now() })
    // }).catch(e => console.error('Analytics error', e));
  }, []);

  // 记录页面访问 (PV)
  useEffect(() => {
    sendToAnalytics('page_view', {
      title: document.title,
      url: window.location.href
    });
  }, [sendToAnalytics]);

  return { trackEvent: sendToAnalytics };
};

// --- Global Analytics Helper ---
// 为了避免在复杂组件中出现作用域引用问题，我们定义一个全局辅助函数
window.logEvent = function(eventName, data = {}) {
  console.log(`[Analytics] ${eventName}`, data);
  if (window._hmt) {
    window._hmt.push(['_trackEvent', 'interaction', eventName, JSON.stringify(data)]);
  }
};

// 主动激活增量：共用原工作台、会话消息、确认卡及资源列表。全部为本地演示数据。
const activationCategories = [
  { id: 'ACT-001', name: '沉默用户mcp激活' },
  { id: 'ACT-002', name: '开口用户需求追问' },
  { id: 'ACT-003', name: '捡漏雷达工具' },
  { id: 'ACT-004', name: '开口用户房源+户型图' },
  { id: 'ACT-005', name: '开口用户ai发挥' }
];
const activationRevisions = Object.fromEntries(activationCategories.map(c => [c.id, 1]));
const activationTasks: Record<string, any> = {};
const activationChannel = (type, city) => type === 'workflow' ? '工作流私聊 - 光年' : ['南京','合肥','无锡','西安','苏州','芜湖'].includes(city) ? `企微私聊-光年本地（${city === '南京' ? '南京新房' : city}）` : '';
const activationImage = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300"><rect width="500" height="300" fill="#eef2ed"/><text x="20" y="30" font-size="16" fill="#627a69">户型示意 · 演示图片</text><g fill="#fffdf6" stroke="#839989" stroke-width="5"><rect x="25" y="55" width="450" height="220"/><path d="M170 55V275M340 55V275M25 170H170M340 170H475"/></g><g fill="#708577" font-size="17"><text x="70" y="120">卧室</text><text x="215" y="165">客餐厅</text><text x="385" y="120">卧室</text><text x="68" y="230">书房</text><text x="385" y="230">厨房</text></g></svg>');
const activationRadarImage = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="280"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#ff9d00"/><stop offset="1" stop-color="#ff4e00"/></linearGradient></defs><rect width="600" height="280" fill="url(#g)"/><circle cx="520" cy="70" r="62" fill="#fff2d2" opacity=".45"/><path d="M475 235l42-74 31 30 28-54" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><text x="42" y="90" font-family="Arial" font-size="36" font-weight="700" fill="white">根据您的需求精选</text><text x="42" y="140" font-family="Arial" font-size="42" font-weight="700" fill="white">近期降价房源</text><rect x="42" y="180" width="230" height="48" rx="24" fill="#fff"/><text x="65" y="212" font-family="Arial" font-size="20" font-weight="700" fill="#f25800">低于同小区同户型均价</text></svg>');
const activationUserProfile = (name = '') => {
  const nickname = name.replace('群内客户-', '') || '样本用户';
  const idMap: Record<string, string> = { '橙子': '788100000001', '家和万事兴': '788100000002' };
  const colors = nickname === '家和万事兴' ? ['#c99a61', '#704b2a'] : ['#7fb3b8', '#355c69'];
  const avatar = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="a" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="96" height="96" rx="48" fill="url(#a)"/><circle cx="48" cy="37" r="17" fill="#fde8d5"/><path d="M18 87c4-19 16-29 30-29s26 10 30 29" fill="#f4f6f8"/><text x="48" y="91" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="#45525b">${nickname.slice(0, 1)}</text></svg>`);
  return { nickname, id: idMap[nickname] || '788100000003', avatar };
};
const activationMessages = (id, revision, person = '橙子') => {
  const texts = {
    'ACT-001': '最近合肥不少楼盘特价房，比之前便宜了三十万左右😊，您有关注的区域或者户型吗？',
    'ACT-002': '看到您关注北城世纪城、瑶海区以及地铁口附近，预算在100万左右，想找90-110平的三房。我这边刚好有一些符合您条件的新房源刚刚上线，要不要发给您看看？',
    'ACT-003': '我帮您整理了近7天降价捡漏的房源，各区域和面积的房源都有，您可以看看哈～咱们有重点关注的区域吗？',
    'ACT-004': '您好，刚有一套信达天御悦澜园三房两厅房源上线，109.28平米，业主挂牌188万，价格空间还挺大。这个小区环境和口碑不错，附近板块二手房也挺抢手。您要先看看户型图，还是想了解下类似房源呢？',
    'ACT-005': '一直没忘您在肥西看的两百万四房，这两天刷到一个高得房率的，空间各方面利用得挺好，居住价值很高。对了，您锁定四房是平时常住人口多，还是想留个独立空间当书房呀？'
  };
  if (id === 'ACT-003') return [{type:'小程序卡片',title:'为你精选近7日捡漏房源',image:activationRadarImage,delay:0},{type:'文本',body:texts[id],delay:1}];
  if (id === 'ACT-004') return [{type:'图片',body:activationImage,delay:0},{type:'文本',body:texts[id],delay:1}];
  return [{ type: '文本', body: texts[id], delay: 0 }];
};
function ActivationMessageList({ items }) {
  const [zoom, setZoom] = useState(false);
  const [link, setLink] = useState(false);
  return <div className="space-y-2">{items.map((item,i)=><div key={i} className="border border-zinc-200 rounded-lg overflow-hidden"><div className="px-3 py-1 bg-zinc-50 text-[11px] text-zinc-500">内容 {i+1} · {item.type} · 发送延迟 {item.delay} 秒</div><div className="p-3 text-sm whitespace-pre-wrap break-words">{item.type === '图片' ? <button onClick={()=>setZoom(true)} title="放大图片"><img src={item.body} alt="房源户型演示图片" className="h-32 rounded" /></button> : item.type === '小程序卡片' ? <div className="overflow-hidden rounded-lg border border-zinc-100"><div className="px-3 py-2 text-sm font-medium">{item.title}</div><img src={item.image} alt={item.title} className="w-full rounded-b-lg" /></div> : item.body}</div></div>)}{zoom && <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-8" onClick={()=>setZoom(false)}><div className="bg-white p-5 rounded-xl max-w-xl"><button className="float-right" aria-label="关闭图片">×</button><img src={activationImage} alt="放大户型示意" /></div></div>}</div>;
}
function ActivationChoiceCard({ data, onRefresh, onRetry, onConfirm, onUser }) {
  const draft=data.draft;
  const audience=data.audiences.find(a=>a.name===draft.audience);
  const disabled=data.confirmed || data.loading;
  const sample=draft.audience.includes('南京')?'家和万事兴':'橙子';
  const sampleProfile=activationUserProfile(sample);
  return <div data-testid="activation-choice" className="w-full bg-white border border-zinc-200 rounded-xl p-4 space-y-3 shadow-sm">
    <h3 className="text-sm font-medium">主动激活内容</h3>
    <label className="block text-xs text-zinc-500">引用人群包<select aria-label="主动激活人群包" value={draft.audience} disabled={disabled} onChange={e=>onRefresh({...draft,audience:e.target.value,error:''})} className="w-full border rounded-lg p-2 mt-1 text-zinc-800 disabled:opacity-50"><option value="">请选择当前会话人群包</option>{data.audiences.map(a=><option key={a.id} value={a.name}>{a.name}</option>)}</select></label>
    <label className="block text-xs text-zinc-500">主动激活策略<select aria-label="主动激活策略" value={draft.strategyId} disabled={disabled} onChange={e=>onRefresh({...draft,strategyId:e.target.value,error:''})} className="w-full border rounded-lg p-2 mt-1 text-zinc-800 disabled:opacity-50"><option value="">请选择策略</option>{activationCategories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    {draft.error&&<p role="alert" className="text-xs text-red-600">{draft.error}</p>}
    {data.loading?<><p role="status" className="text-xs text-zinc-500">内容生成中…</p><button disabled className="w-full bg-zinc-900 text-white rounded-lg py-2 text-sm disabled:opacity-40">确认使用</button></>:draft.generationError?<><p role="alert" className="text-xs text-red-600">{draft.generationError}</p><button onClick={onRetry} className="w-full bg-zinc-900 text-white rounded-lg py-2 text-sm">重新生成</button><button disabled className="w-full border border-zinc-200 text-zinc-400 rounded-lg py-2 text-sm">确认使用</button></>:!audience?<p className="text-xs text-zinc-500">请选择人群包。</p>:!audience.audienceCount?<p role="alert" className="text-xs text-red-600">人群包为空，无法生成示例。</p>:!draft.strategyId?<p className="text-xs text-zinc-500">请选择策略。</p>:<><div className="space-y-3"><h3 className="text-sm font-medium">内容示例</h3><button aria-label={`查看用户 ${sampleProfile.nickname} 详情`} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700" onClick={()=>onUser(sample)}><img src={sampleProfile.avatar} alt={`${sampleProfile.nickname}头像`} className="w-7 h-7 rounded-full border border-white shadow-sm"/><span>{sampleProfile.nickname}</span><span className="text-zinc-400">· 样本用户（点击查看）</span></button><ActivationMessageList items={draft.preview}/></div><button disabled={disabled} onClick={onConfirm} className="w-full bg-zinc-900 text-white rounded-lg py-2 text-sm disabled:opacity-40">{data.confirmed?'已确认使用':'确认使用'}</button></>}
  </div>;
}
function ActivationTaskDetail({ taskId }) {
  const t=activationTasks[taskId];
  if(!t)return <div className="p-6">任务不存在，请从本会话重新创建。</div>;
  const c=activationCategories.find(c=>c.id===t.strategyId);
  const interval=t.interval || t.pushInterval || '5～10';
  const blacklists=(t.blacklist || []).join('、') || '无';
  const row=(label: string,value: any) => <div className="flex"><span className="text-zinc-500 w-24 shrink-0">{label}</span><span className="text-zinc-900 dark:text-zinc-100 break-words">{value || '-'}</span></div>;
  return <div className="w-full h-full bg-white dark:bg-zinc-950 flex flex-col overflow-y-auto" data-testid="activation-task-detail">
    <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 p-4 shrink-0"><div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Send size={20}/></div><div><h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">推送任务详情</h2><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 mt-1"><span>TASK_ID: {taskId}</span><span>|</span><span>推送状态: 待执行</span><span>|</span><span>创建人: AI助手</span><span>|</span><span>创建时间: {t.createdAt || '刚刚'}</span></div></div></div>
    <div className="p-6 space-y-8 max-w-5xl">
      <section><h3 className="text-lg font-bold text-blue-600 mb-4">基本信息</h3><div className="grid grid-cols-2 gap-y-4 gap-x-12 text-sm">{row('TASK_ID:',taskId)}{row('推送状态:','待执行')}{row('名称:',t.name)}{row('主题:','智能推荐')}{row('推送时间:',t.pushTime)}{row('推送间隔:',interval)}{row('通道:',activationChannel('active',t.city))}{row('免打扰时段:','22:00:00-08:00:00')}{row('优先级:','0')}</div></section>
      <section><h3 className="text-lg font-bold text-blue-600 mb-4">收件人</h3><div className="space-y-4 text-sm">{row('人群包类型:','AI人群包')}<div className="flex flex-wrap gap-x-6 gap-y-2">{row('人群包名称:',t.audience)}{row('人数:',(t.audienceCount || '-')+' 人')}{row('更新时间:',t.audienceUpdatedAt || '刚刚')}</div>{row('黑名单:',blacklists)}{row('白名单:','-')}</div></section>
      <section><h3 className="text-lg font-bold text-blue-600 mb-4">发送人</h3>{row('发送人:',t.sender || 'C端客服')}</section>
      <section><h3 className="text-lg font-bold text-blue-600 mb-4">推送内容</h3><div className="text-sm bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">{row('主动激活策略：',c?.name || '-')}</div></section>
    </div>
  </div>;
}
function ActivationMemoryPanel() {
  const block=(title: string, rows: [string,string][]) => <section className="space-y-2"><h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3><div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 divide-y divide-zinc-100 dark:divide-zinc-700">{rows.map(([label,value])=><div key={label} className="px-3 py-2.5"><div className="text-xs text-zinc-400">{label}</div><div className="text-sm text-zinc-700 dark:text-zinc-200 mt-1">{value}</div></div>)}</div></section>;
  return <div className="space-y-5"><section className="space-y-2"><h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">用户阶段</h3><span className="inline-flex px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">观望期</span></section>{block('长期记忆 / 当前购房需求',[['目标小区','鸿达新寓'],['房产需求','买房'],['物业类型','住宅']])}{block('偏好',[['附属空间要求','储藏间']])}</div>;
}
function ActivationBehaviorPanel() {
  const events=[
    ['2026-08-15 18:54:13','页面浏览 - 楼盘详情页 - 2秒','第一国际，新吴区/坊前'],
    ['2026-08-15 18:54:11','页面浏览 - 特价房列表 - 10秒','第一国际'],
    ['2026-08-15 18:54:01','页面浏览 - 楼盘详情页 - 0秒','第一国际，新吴区/坊前'],
    ['2026-07-11 23:24:45','页面浏览 - 楼盘相册 - 0秒','无锡科技城，梁溪区/山北，61.0万-187.0万/60.0㎡-139.0㎡']
  ];
  return <div className="relative pl-5 space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-200 dark:before:bg-zinc-700">{events.map(([time,title,detail])=><div key={time} className="relative"><span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-zinc-900"/><div className="text-xs text-zinc-400">{time}</div><div className="text-sm text-zinc-700 dark:text-zinc-200 mt-1">{title}</div><div className="text-xs text-zinc-400 mt-1 leading-5">{detail}</div></div>)}</div>;
}

// 圈选样本演示数据仅用于原型，切换样本时三类信息都跟随当前用户更新。
const audiencePreviewData: Record<string, any> = {
  '张三': {
    id: '788100000101',
    profile: [['意向价格','100万以内'],['意向购房面积/户型','90-110㎡ / 三房'],['首付预算','30万左右'],['购房目的','学区房'],['关注区域','合肥政务区']],
    stage: '明确购房需求',
    memory: [{ title: '长期记忆 / 当前购房需求', rows: [['房产需求','买房'],['目标区域','合肥政务区'],['总价预算','100万以内']] }, { title: '偏好', rows: [['户型偏好','三房'],['位置偏好','近地铁']] }],
    behavior: [['2026-10-18 18:54','浏览楼盘详情','合肥政务区 · 三房'],['2026-10-16 11:20','浏览小区页面','政务区学区房']]
  },
  '李四': {
    id: '788100000102',
    profile: [['意向价格','100-150万'],['意向购房面积/户型','80-100㎡ / 两房'],['首付预算','40万左右'],['购房目的','自住'],['关注区域','合肥蜀山区']],
    stage: '需求了解中',
    memory: [{ title: '长期记忆 / 当前购房需求', rows: [['房产需求','买房'],['目标区域','合肥蜀山区']] }, { title: '候选记忆', rows: [['总价预算','100-150万'],['面积要求','80-100㎡']] }],
    behavior: [['2026-10-19 09:35','浏览房源列表','蜀山区 · 住宅']]
  },
  '王五': {
    id: '788100000103',
    profile: [['意向价格','未完善'],['意向购房面积/户型','未完善'],['首付预算','未完善'],['购房目的','未完善'],['关注区域','合肥']],
    stage: '', memory: [], behavior: []
  },
  '橙子': { id: '788100000001', profile: [['意向价格','100万以内'],['意向购房面积/户型','90㎡ / 三房'],['关注区域','合肥政务区']], stage: '明确购房需求', memory: [{ title: '长期记忆 / 当前购房需求', rows: [['房产需求','买房'],['目标区域','合肥政务区']] }], behavior: [['2026-10-19 10:20','浏览楼盘详情','政务区 · 三房']] },
  '家和万事兴': { id: '788100000002', profile: [['意向价格','100-150万'],['意向购房面积/户型','100㎡ / 三房'],['关注区域','合肥蜀山区']], stage: '需求了解中', memory: [{ title: '候选记忆', rows: [['房产需求','买房'],['总价预算','100-150万']] }], behavior: [['2026-10-17 14:05','浏览小区页面','蜀山区住宅']] },
  '贝壳张建': { id: '788100000004', profile: [['意向价格','未完善'],['关注区域','合肥']], stage: '', memory: [], behavior: [['2026-10-18 09:15','浏览房源列表','合肥住宅']] },
  '桃燃': { id: '788100000005', profile: [['意向价格','100万以内'],['关注区域','合肥包河区']], stage: '观望期', memory: [{ title: '长期记忆 / 当前购房需求', rows: [['房产需求','买房'],['目标区域','合肥包河区']] }], behavior: [] },
  '用户7892': { id: '788100000006', profile: [['意向价格','未完善'],['关注区域','未完善']], stage: '', memory: [], behavior: [] }
};
function AudiencePreviewMemoryPanel({ userName }: { userName: string }) {
  const user = audiencePreviewData[userName];
  if (!user) return <ActivationMemoryPanel />;
  if (!user.memory.length) return <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-5 text-sm text-zinc-500">暂无可展示的用户记忆</div>;
  return <div className="space-y-5">
    <section className="space-y-2"><h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">用户阶段</h3><span className="inline-flex px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{user.stage}</span></section>
    {user.memory.map((group: any) => <section key={group.title} className="space-y-2"><h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{group.title}</h3><div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 divide-y divide-zinc-100 dark:divide-zinc-700">{group.rows.map(([label,value]: [string,string]) => <div key={label} className="px-3 py-2.5"><div className="text-xs text-zinc-400">{label}</div><div className="text-sm text-zinc-700 dark:text-zinc-200 mt-1">{value}</div></div>)}</div></section>)}
  </div>;
}
function AudiencePreviewBehaviorPanel({ userName }: { userName: string }) {
  const events = audiencePreviewData[userName]?.behavior ?? [];
  if (!events.length) return <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-5 text-sm text-zinc-500">暂无可展示的用户行为</div>;
  return <div className="relative pl-5 space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-200 dark:before:bg-zinc-700">{events.map(([time,title,detail]: [string,string,string]) => <div key={`${time}-${title}`} className="relative"><span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-zinc-900"/><div className="text-xs text-zinc-400">{time}</div><div className="text-sm text-zinc-700 dark:text-zinc-200 mt-1">{title}</div><div className="text-xs text-zinc-400 mt-1 leading-5">{detail}</div></div>)}</div>;
}

// 交付群预览与群聊包详情共用的演示关联；客户记忆直接复用人群包样本。
type SelectionInfoTab = '记忆' | '档案' | '群档案' | '行为';
interface SelectionGroupSample {
  key: string;
  name: string;
  id: string;
  customer: string | null;
  summary: string;
  advice?: [string, string][];
}
const selectionGroupSamples: SelectionGroupSample[] = [
  { key: '群聊1', name: '滨湖买房交流群', id: '10813877036293200', customer: '橙子', summary: '客户关注合肥政务区三房，群内已推送匹配房源，等待客户反馈。', advice: [['运营跟进建议', '结合用户已关注房源进一步确认需求，协调经纪人跟进客户反馈。'], ['分销中介跟进建议', '补充同区域、同预算房源的对比信息，再与客户确认看房安排。']] },
  { key: '群聊2', name: '政务区学区房群', id: '10813877036293201', customer: '家和万事兴', summary: '客户希望购置自住房，预算100—150万，正在进一步确认需求。' },
  { key: '群聊3', name: '合肥刚需上车群', id: '10813877036293202', customer: '用户7892', summary: '客户已入群，尚无可展示的用户记忆和行为记录。' },
  { key: '群聊4', name: '高新买房群', id: '10813877036293203', customer: '桃燃', summary: '客户处于观望阶段，关注合肥包河区房源。' },
  { key: '群聊5', name: '包河改善群', id: '10813877036293204', customer: '贝壳张建', summary: '客户浏览过合肥住宅房源，具体购房需求尚待补充。' },
  { key: '群聊6', name: '待关联客户服务群', id: '10813877036293205', customer: null, summary: '群基础信息可查看，当前未返回可用的关联客户标识。' }
];
const selectionGroupByName = (name: string | null | undefined) => {
  const key = name?.replace(/^群内客户-/, '');
  return selectionGroupSamples.find(group => group.key === key || group.name === key);
};

function GroupCustomerInfo({ group, tab, onTabChange }: { group: SelectionGroupSample; tab: SelectionInfoTab; onTabChange: (tab: SelectionInfoTab) => void }) {
  const user = group.customer ? audiencePreviewData[group.customer] : null;
  const tabLabels: Record<SelectionInfoTab, string> = { '群档案': '群档案', '档案': '用户档案', '记忆': '用户记忆', '行为': '用户行为' };
  return <div className="space-y-5 min-w-0" data-testid="group-customer-details">
    <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex items-start gap-2"><MessageSquare size={17} className="mt-1 shrink-0 text-indigo-500" /><div className="min-w-0"><h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 break-words">{group.name}</h2><div className="text-xs text-zinc-500 mt-1 break-all">群ID：{group.id}</div></div></div>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-300 shrink-0">{group.customer?.slice(0, 1) || <User size={18} />}</div>
        <div className="min-w-0"><div className="text-xs text-zinc-500">关联客户</div><div className="font-semibold text-zinc-900 dark:text-zinc-100 break-words">{group.customer || '尚未关联可查看的客户'}</div><div className="text-xs text-zinc-500 mt-1">788ID：{user?.id || '—'}</div></div>
      </div>
    </div>
    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg" role="tablist" aria-label="群聊与客户信息">
      {(['群档案', '档案', '记忆', '行为'] as const).map(item => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => onTabChange(item)} className={`flex-1 py-1.5 text-sm whitespace-nowrap font-medium rounded-md transition-all ${tab === item ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700'}`}>{tabLabels[item]}</button>)}
    </div>
    {tab === '群档案' ? <div className="space-y-5">
      {([['群聊总结', group.summary], ...(group.advice || [])] as [string, string][]).map(([label, value]) => <section key={label} className="space-y-2"><h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</h3><div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 p-3"><p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">{value}</p></div></section>)}
    </div> : !user ? <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 p-5 text-sm leading-6 text-zinc-500">无法确定该群关联客户，暂不可查看{tabLabels[tab]}。</div> : tab === '档案' ? <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 divide-y divide-zinc-100 dark:divide-zinc-700">{user.profile.map(([label, value]: [string, string]) => <div key={label} className="px-3 py-2.5"><div className="text-xs text-zinc-500">{label}</div><div className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">{value}</div></div>)}</div> : tab === '记忆' ? <AudiencePreviewMemoryPanel userName={group.customer!} /> : <AudiencePreviewBehaviorPanel userName={group.customer!} />}
  </div>;
}

// --- src/types.ts ---
type Role = 'user' | 'ai';

type TaskStatus = 'wait' | 'loading' | 'done';

interface TaskItem {
  id: string;
  text: string;
  status: TaskStatus;
}

type CardData =
  | { type: 'b_step'; flowId: string; stage: string; snapshot: any; confirmed?: boolean; invalidated?: boolean }
  | { type: 'proactive_choice'; draft: any; audiences: any[]; pushContext?: any; confirmed?: boolean }
  | { type: 'audience'; name: string; count: number; updateCycle: 'hour' | 'day' | 'once'; samples: string[]; confirmed?: boolean; nameError?: string; audienceType?: 'b'; bFlowId?: string; invalidated?: boolean }
  | { type: 'group_package'; name: string; count: number; updateCycle: 'hour' | 'day' | 'once'; samples: string[]; confirmed?: boolean }
  | { type: 'config'; senders: string[]; blacklists: string[]; confirmed?: boolean; proactive?: any }
  | { type: 'content_preview'; title: string; content: string; confirmed?: boolean; proactive?: any }
  | { type: 'task_summary'; taskName: string; channel: string; pushTime: string; pushInterval: string; recipient: string; content: string; sender: string; confirmed?: boolean; proactive?: any; bFlowId?: string; invalidated?: boolean };

interface Message {
  id: string;
  role: Role;
  content?: string;
  images?: string[];
  taskPlan?: TaskItem[];
  card?: CardData;
  loading?: boolean;
  progress?: number;
  actionButton?: { label: string; tabName: string };
  bFlowId?: string;
  bPlanFlowId?: string;
  bStage?: 'conditions';
}

interface Bubble {
  id: string;
  type: 'audience' | 'task' | 'group';
  text: string;
  items: { id: string; name: string; tabName: string; channel?: string }[];
}

type AssistantResourceView = 'chat' | 'audience' | 'group' | 'task';
type AudienceResourceStatus = '生成中' | '已生成' | '生成失败' | '草稿';
type GroupResourceStatus = '生成中' | '已生成' | '生成失败' | '草稿';
type PushTaskStatus = '草稿' | '待执行' | '执行中' | '已完成' | '已失败' | '已取消';

interface AudienceResource {
  id: string;
  name: string;
  originalName: string;
  tabName: string;
  type: string;
  source: string;
  status: AudienceResourceStatus;
  audienceCount: number;
  createdAt: string;
  updatedAt: string;
  updatedOrder: number;
  relatedTaskCount: number;
  configSnapshot: string[];
}

interface PushTaskResource {
  id: string;
  name: string;
  originalName: string;
  tabName: string;
  pushType: string;
  status: PushTaskStatus;
  relatedAudienceName: string;
  estimatedReach: number;
  pushTime: string;
  createdAt: string;
  updatedAt: string;
  updatedOrder: number;
  creator: string;
  configSnapshot: string[];
  executionResult: string;
}

interface GroupResource {
  id: string;
  name: string;
  originalName: string;
  tabName: string;
  status: GroupResourceStatus;
  groupCount: number;
  customerCount: number;
  createdAt: string;
  updatedAt: string;
  updatedOrder: number;
  relatedTaskCount: number;
  configSnapshot: string[];
}

interface Tab {
  id: string;
  title: string;
  content: string;
}

interface MomentLike {
    userId: string;
    name: string;
    avatar: string;
}

interface MomentLikeWithFrequency extends MomentLike {
    recentLikeCount?: number;
}

interface MomentComment {
    id: string;
    userId: string;
    name: string;
    avatar: string;
    content: string;
    image?: string;
    time: string;
    replyToName?: string; // Name of the person being replied to
    replyToId?: string;   // ID of the person being replied to
}

interface SimMoment {
    id: string;
    groupId: string;
    accountId: string; // The enterprise account that posted this
    content: string;
    media: {
        type: 'image' | 'video' | 'channels' | 'link',
        url: string,
        title?: string,
        thumbnail?: string,
        desc?: string
    }[];
    time: string;
    likes: MomentLike[];
    comments: MomentComment[];
}

interface EnterpriseAccount {
    id: string;
    name: string;
    avatar: string;
    city: string;
    lastMoment?: {
        content?: string;
        type: 'text' | 'image' | 'video' | 'channels';
    };
}


// --- src/components/ProfileField.tsx ---

function ProfileField({ label, value, type, time }: { label: string, value: string, type: string, time: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-500">{label}</span>
        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 rounded">{type}</span>
      </div>
      <div className="font-medium text-zinc-900 dark:text-zinc-100">{value}</div>
      <div className="text-[10px] text-zinc-400">{time}</div>
    </div>
  );
}

// --- src/components/Cards.tsx ---

// --- confirm card name edit helper ---
const MAX_CONFIRM_CARD_NAME_LENGTH = 20;

function getConfirmCardNameLength(value) {
  return Array.from((value || '').trim()).length;
}

function validateConfirmCardName(value) {
  const trimmedValue = (value || '').trim();
  if (!trimmedValue) return '名称不能为空';
  if (getConfirmCardNameLength(trimmedValue) > MAX_CONFIRM_CARD_NAME_LENGTH) return '名称最多20个汉字';
  return '';
}
// --- end confirm card name edit helper ---

function ConfirmCardNameField({
  label,
  value,
  error,
  confirmed,
  onChange
}: {
  label: string;
  value: string;
  error: string;
  confirmed?: boolean;
  onChange: (value: string) => void;
}) {
  const nameLength = getConfirmCardNameLength(value);

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-zinc-900/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      {!confirmed ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`请输入${label}`}
          className={`h-9 w-full rounded-md border bg-white dark:bg-zinc-950 px-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none transition-colors ${
            error
              ? 'border-red-300 dark:border-red-800 focus:border-red-400'
              : 'border-indigo-200 dark:border-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600'
          }`}
        />
      ) : (
        <div className="min-h-[28px] text-sm font-semibold text-zinc-900 dark:text-zinc-100 break-all">
          {value}
        </div>
      )}
      {!confirmed && (
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className={error ? 'text-red-500' : 'text-zinc-400'}>
            {error || '输入后自动保留，确认时生效'}
          </span>
          <span className={nameLength > MAX_CONFIRM_CARD_NAME_LENGTH ? 'text-red-500' : 'text-zinc-400'}>
            {nameLength}/{MAX_CONFIRM_CARD_NAME_LENGTH}
          </span>
        </div>
      )}
    </div>
  );
}

function AudienceCard({ data, onUserClick, onConfirm, onNameChange }: { data: Extract<CardData, { type: 'audience' }>, onUserClick: (name: string, list?: string[]) => void, onConfirm: (name: string) => void, onNameChange: (name: string) => void }) {
  const editableName = data.name;
  const nameError = data.nameError || '';
  const cycleMap = { 'hour': '每小时更新', 'day': '每日更新', 'once': '一次性' };
  const handleConfirm = () => onConfirm(editableName);

  return (
    <div data-testid="audience-preview-card" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users size={16} />
            </div>
            人群预览
          </div>
          <div className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
            预估 {data.count.toLocaleString()} 人
          </div>
        </div>

        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
          <ConfirmCardNameField
            label="人群包名称"
            value={editableName}
            error={nameError}
            confirmed={data.confirmed}
            onChange={onNameChange}
          />
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">更新周期</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{cycleMap[data.updateCycle]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-zinc-500">抽样用户（点击查看记忆、档案与行为）</div>
          <div className="flex flex-wrap gap-2">
            {data.samples.map((sample, i) => (
              <button
                key={i}
                onClick={() => onUserClick(sample, data.samples)}
                className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={data.confirmed || (data.audienceType === 'b' && data.count === 0)}
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-2 ${
            data.confirmed
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/50'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
          }`}
        >
          {data.confirmed ? (
            <><Check size={16} /> 已确认创建</>
          ) : (
            '确认创建人群包'
          )}
        </button>
      </div>
    </div>
  );
}

function GroupPackageCard({ data, onGroupClick, onUserClick, onConfirm }: { data: Extract<CardData, { type: 'group_package' }>, onGroupClick: (name: string, list?: string[]) => void, onUserClick: (name: string, list?: string[]) => void, onConfirm: (name: string) => void }) {
  const [editableName, setEditableName] = useState(data.name);
  const [nameError, setNameError] = useState('');
  const cycleMap = {
    'hour': '每小时更新',
    'day': '每日更新',
    'once': '一次性'
  };

  useEffect(() => {
    setEditableName(data.name);
    setNameError('');
  }, [data.name]);

  const handleConfirm = () => {
    const error = validateConfirmCardName(editableName);
    if (error) {
      setNameError(error);
      return;
    }
    onConfirm(editableName.trim());
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User size={16} />
            </div>
            群聊包预览
          </div>
          <div className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
            预估 {data.count.toLocaleString()} 个
          </div>
        </div>

        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
          <ConfirmCardNameField
            label="群聊包名称"
            value={editableName}
            error={nameError}
            confirmed={data.confirmed}
            onChange={(value) => {
              setEditableName(value);
              setNameError('');
            }}
          />
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">更新周期</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{cycleMap[data.updateCycle]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-zinc-500">抽样群聊（点击查看群及客户详情）</div>
          <div className="flex flex-wrap gap-2">
            {data.samples.map((sample, i) => (
              <div
                key={i}
                className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-full overflow-hidden transition-colors hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                <button
                  onClick={() => onGroupClick(sample, data.samples)}
                  className="px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 border-r border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  {sample}
                </button>
                <button
                  onClick={() => onUserClick(sample, data.samples)}
                  title={`查看${sample}关联客户的用户记忆、用户档案与用户行为`}
                  className="px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  客户详情
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={data.confirmed}
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-2 ${
            data.confirmed
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/50'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
          }`}
        >
          {data.confirmed ? (
            <><Check size={16} /> 已确认创建</>
          ) : (
            '确认创建群聊包'
          )}
        </button>
      </div>
    </div>
  );
}

function ConfigCard({ data, onConfirm }: { data: Extract<CardData, { type: 'config' }>, onConfirm: (config?: any) => void }) {
  const [sender, setSender] = useState(data.senders[0] || 'C端客服');
  const [blacklist, setBlacklist] = useState<string[]>(data.blacklists || []);
  const [city, setCity] = useState(data.proactive?.city || '南京');

  const blacklistOptions = ['中介同行', '无购房需求', '频繁转派用户', '同事'];
  const cityOptions = ['南京', '无锡', '合肥', '苏州', '西安', '芜湖'];

  const toggleBlacklist = (option: string) => {
    if (data.confirmed) return;
    setBlacklist(prev =>
      prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
    );
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Send size={16} />
          </div>
          推送任务配置
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500">发送人选择</label>
            <div className="relative">
                <select
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    disabled={data.confirmed}
                    className="w-full appearance-none px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-700 dark:text-zinc-300"
                >
                    <option value="C端客服">C端客服</option>
                    <option value="B端客服">B端客服</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500">黑名单过滤</label>
            <div className="flex flex-wrap gap-2">
                {blacklistOptions.map(opt => (
                    <button
                        key={opt}
                        onClick={() => toggleBlacklist(opt)}
                        disabled={data.confirmed}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                            blacklist.includes(opt)
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 hover:bg-zinc-100'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500">城市</label>
            <div className="relative">
                <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={data.confirmed}
                    className="w-full appearance-none px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-700 dark:text-zinc-300"
                >
                    {cityOptions.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          onClick={() => data.proactive ? onConfirm({city,sender,blacklist}) : onConfirm()}
          disabled={data.confirmed}
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            data.confirmed
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/50'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
          }`}
        >
          {data.confirmed ? (
            <><Check size={16} /> 已确认配置</>
          ) : (
            '确认配置'
          )}
        </button>
      </div>
    </div>
  );
}

function ContentPreviewCard({ data, onConfirm, onChange, onUser }: { data: Extract<CardData, { type: 'content_preview' }>; onConfirm?: () => void; onChange?: () => void; onUser?: (name: string) => void }) {

  // Filter out the specific text
  const cleanContent = data.content.trim();

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm mt-2">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
           <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Send size={16} />
          </div>
          {data.title}
        </div>

        <div className="flex flex-col gap-2">
            {/* Text Content */}
            {cleanContent && (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap">
                  {cleanContent}
                </div>
            )}

            {/* Images Grid - 3 images example */}
            <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                        <ImageIcon size={20} className="text-zinc-400" />
                    </div>
                ))}
            </div>

            {/* Mini Program Card */}
            <div className="flex gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">小程序标题</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function TaskSummaryCard({ data, onConfirm }: { data: Extract<CardData, { type: 'task_summary' }>, onConfirm: (taskName: string) => void }) {
  const [editableName, setEditableName] = useState(data.taskName);
  const [nameError, setNameError] = useState('');
  const fields = [
    { label: '通道', value: data.channel },
    { label: '推送时间', value: data.pushTime },
    { label: '推送间隔', value: data.pushInterval },
    { label: '接收对象', value: data.recipient },
    { label: '发送人', value: data.sender },
  ];

  useEffect(() => {
    setEditableName(data.taskName);
    setNameError('');
  }, [data.taskName]);

  const handleConfirm = () => {
    const error = validateConfirmCardName(editableName);
    if (error) {
      setNameError(error);
      return;
    }
    onConfirm(editableName.trim());
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm mt-2">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Send size={16} />
          </div>
          任务信息确认
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="col-span-2">
            <ConfirmCardNameField
              label="任务名称"
              value={editableName}
              error={nameError}
              confirmed={data.confirmed}
              onChange={(value) => {
                setEditableName(value);
                setNameError('');
              }}
            />
          </div>
          {fields.map((field, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-zinc-500">{field.label}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate" title={field.value}>{field.value}</span>
            </div>
          ))}
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-zinc-500">发送内容</span>
            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 break-all">
              {data.content}
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={data.confirmed}
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-2 ${
            data.confirmed
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/50'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
          }`}
        >
          {data.confirmed ? (
            <><Check size={16} /> 已确认执行</>
          ) : (
            '确认执行任务'
          )}
        </button>
      </div>
    </div>
  );
}

// --- src/components/SmartInput.tsx ---

interface SmartInputProps {
  sessionAudiences?: string[];
  sessionAudienceOptions?: {id:string,name:string,label?:string}[];
  onSelectAudience?: (id:string)=>void;
  mode: '圈选模式' | '执行模式';
  setMode: (mode: '圈选模式' | '执行模式') => void;
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string, images?: string[]) => void;
  bubbles: Bubble[];
  onBubbleClick: (tabName: string) => void;
  activeBubbleId?: string | null;
  onBubbleToggle?: (id: string | null) => void;
  locked?: boolean;
  lockPlaceholder?: string;
  notifyBAvailable?: boolean;
  pendingAction?: { type: 'append', text: string, id: number } | null;
}

interface ContextItem {
  id: string;
  text: string;
  type: 'group';
}

function SmartInput({ mode, setMode, value, onChange, onSubmit, bubbles, onBubbleClick, activeBubbleId: propActiveBubbleId, onBubbleToggle, locked, lockPlaceholder, notifyBAvailable, pendingAction, sessionAudiences, sessionAudienceOptions, onSelectAudience }: SmartInputProps) {
  const [internalActiveBubbleId, setInternalActiveBubbleId] = useState<string | null>(null);
  const [atCategory, setAtCategory] = useState<string | null>(null);
  // Contexts removed as per request to have inline text
  // const [contexts, setContexts] = useState<ContextItem[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImages(prev => {
              if (prev.length >= 9) return prev;
              return [...prev, ev.target!.result as string];
            });
          }
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      const hasImage = Array.from(e.clipboardData.files).some(f => f.type.startsWith('image/'));
      if (hasImage) {
          e.preventDefault();
          Array.from(e.clipboardData.files).forEach(file => {
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImages(prev => {
                      if (prev.length >= 9) return prev;
                      return [...prev, ev.target!.result as string];
                    });
                }
              };
              reader.readAsDataURL(file);
            }
          });
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const activeBubbleId = propActiveBubbleId !== undefined ? propActiveBubbleId : internalActiveBubbleId;
  const setActiveBubbleId = onBubbleToggle || setInternalActiveBubbleId;

  // Handle pending actions (e.g. from context menu)
  useEffect(() => {
    if (pendingAction && pendingAction.type === 'append') {
      const textToAppend = pendingAction.text;
      const newValue = value ? `${value} ${textToAppend}` : textToAppend;
      onChange(newValue);

      // Focus input and set cursor to end
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const len = inputRef.current.value.length;
          inputRef.current.setSelectionRange(len, len);
        }
      }, 100);
    }
  }, [pendingAction]);

  // const removeContext = (id: string) => {
  //   setContexts(prev => prev.filter(c => c.id !== id));
  // };

  const lastAtIndex = value.lastIndexOf('@');
  const lastSlashIndex = value.lastIndexOf('/');

  const activeAtQuery = lastAtIndex !== -1 && !/[\s，。；]/.test(value.slice(lastAtIndex)) ? value.slice(lastAtIndex + 1) : null;
  const activeSlashQuery = lastSlashIndex !== -1 && !value.slice(lastSlashIndex).includes(' ') ? value.slice(lastSlashIndex + 1) : null;

  const isAtActive = activeAtQuery !== null && (lastSlashIndex === -1 || lastAtIndex > lastSlashIndex);
  const isSlashActive = activeSlashQuery !== null && (lastAtIndex === -1 || lastSlashIndex > lastAtIndex);

  useEffect(() => {
    if (!isAtActive) {
      setAtCategory(null);
    }
  }, [isAtActive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Backspace handling removed as contexts are no longer used
    // if (e.key === 'Backspace' && value === '' && contexts.length > 0) {
    //   e.preventDefault();
    //   setContexts(prev => prev.slice(0, -1));
    //   return;
    // }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isAtActive || (isSlashActive && !['人群圈选','小B圈选','通知小B','小B通知触达','多渠道触达'].some(skill => activeSlashQuery?.startsWith(skill)))) return; // Existing menus retain their behavior; explicit audience and multi-channel Skill commands can be submitted.
      if (!locked) {
        // Include contexts in submission if needed, or just handle text
        // For now, we assume contexts are handled separately or just visual
        // If they need to be part of the message, we might need to modify onSubmit signature
        // But the requirement is about display style.
        onSubmit(value);
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    setAtCategory(category);
    inputRef.current?.focus();
  };

  const insertItem = (itemName: string, audienceId?:string) => {
    if(audienceId)onSelectAudience?.(audienceId);
    if (isAtActive) {
      const newVal = value.slice(0, lastAtIndex) + '@' + itemName + ' ';
      onChange(newVal);
      setAtCategory(null);
    } else if (isSlashActive) {
      const newVal = value.slice(0, lastSlashIndex) + '/' + itemName + ' ';
      onChange(newVal);
    }
    inputRef.current?.focus();
  };

  const getAllMockResults = (query: string) => {
    let allItems:any[] = [
      { category: '人群包', name: '南京100万客户' },
      { category: '人群包', name: '合肥政务区高意向人群' },
      { category: '人群包', name: '近30天活跃用户' },
      { category: '人群包', name: '未复购流失预警人群' },
      { category: '图片', name: '春季上新海报.png' },
      { category: '图片', name: '双十一大促.jpg' },
      { category: '图片', name: '产品介绍图.png' },
      { category: '小程序卡片', name: '商品详情页' },
      { category: '小程序卡片', name: '活动主会场' },
      { category: '小程序卡片', name: '会员中心' }
    ];
    if (mode === '圈选模式') {
      allItems = [
        ...allItems,
        { category: 'CDP人群包', name: '双十一大促高潜人群' },
        { category: 'CDP人群包', name: '上海地区VIP会员' },
        { category: 'CDP人群包', name: '近90天未登录流失人群' }
      ];
    }
    if(sessionAudiences)allItems=[...allItems.filter(i=>i.category!=='人群包'),...(sessionAudienceOptions||sessionAudiences.map(name=>({name}))).map(a=>({...a,category:'人群包'}))];
    return allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  };

  const getMockResults = (category: string, query: string) => {
    let items: string[] = [];
    if (category === '人群包') items = sessionAudiences || ['南京100万客户', '合肥政务区高意向人群', '近30天活跃用户', '未复购流失预警人群'];
    if (category === 'CDP人群包') items = ['双十一大促高潜人群', '上海地区VIP会员', '近90天未登录流失人群'];
    if (category === '图片') items = ['春季上新海报.png', '双十一大促.jpg', '产品介绍图.png'];
    if (category === '小程序卡片') items = ['商品详情页', '活动主会场', '会员中心'];

    return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  };

  const getCategoryIcon = (category: string) => {
    if (category === '人群包' || category === 'CDP人群包') return <Users size={14} />;
    if (category === '图片') return <ImageIcon size={14} />;
    if (category === '小程序卡片') return <FileText size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div className="relative group">
      {/* Animated Border Background */}
      <div
        className={`absolute -inset-[2px] rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 ${!locked && 'group-focus-within:opacity-100'} blur-[3px]`}
        style={{ backgroundSize: '200% 200%', animation: 'gradient-move 3s ease infinite' }}
      ></div>
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className={`relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm transition-all ${locked ? 'opacity-80' : 'group-focus-within:border-transparent bg-clip-padding'}`}>

      {/* Bubbles Area */}
      {bubbles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pt-3 pb-1 relative">
          <AnimatePresence>
            {bubbles.map(bubble => (
              <div key={bubble.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                    activeBubbleId === bubble.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                      : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-indigo-100 dark:border-indigo-800/50'
                  }`}
                  onClick={() => setActiveBubbleId(activeBubbleId === bubble.id ? null : bubble.id)}
                >
                  {bubble.type === 'audience' ? <Users size={12} /> : bubble.type === 'group' ? <MessageSquare size={12} /> : <Zap size={12} />}
                  {bubble.text}
                </motion.div>

                {/* Bubble List Popup */}
                <AnimatePresence>
                  {activeBubbleId === bubble.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 dark:border-zinc-700">
                        {bubble.type === 'audience' ? '人群包列表' : bubble.type === 'group' ? '群聊包列表' : '任务列表'}
                      </div>
                      <div className="p-1">
                        {bubble.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer transition-colors"
                            onClick={() => {
                              setActiveBubbleId(null);
                              onBubbleClick(item.tabName);
                            }}
                          >
                            <span className="text-zinc-400">
                              {bubble.type === 'audience' ? <Users size={14} /> : bubble.type === 'group' ? <MessageSquare size={14} /> : <Zap size={14} />}
                            </span>
                            <div className="min-w-0"><span className="block truncate">{item.name}</span>{item.channel&&<span className="block truncate text-xs text-zinc-500">{item.channel}</span>}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Top Bar: Mode Selector */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 relative">
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
          <button
            onClick={() => !locked && setMode('圈选模式')}
            disabled={locked}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === '圈选模式' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'} disabled:opacity-50`}
          >
            圈选模式
          </button>
          <button
            onClick={() => !locked && setMode('执行模式')}
            disabled={locked}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === '执行模式' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'} disabled:opacity-50`}
          >
            执行模式
          </button>
        </div>
      </div>

      {/* Contexts Area - Removed as requested */}

      {/* Images Preview Area */}
      {images.length > 0 && (
        <div className="px-3 pt-2 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <div key={i} className="relative group/img shrink-0">
              <div className="w-16 h-16 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <img src={img} alt="preview" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-zinc-500 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea Wrapper */}
      <div className="relative w-full">
        {/* Mirror div for @ placeholder */}
        {isAtActive && atCategory && activeAtQuery === '' && (
          <div className="absolute inset-0 px-3 py-2 text-sm font-sans leading-normal pointer-events-none whitespace-pre-wrap break-words overflow-hidden" aria-hidden="true">
            <span className="text-transparent">{value}</span>
            <span className="text-zinc-400 dark:text-zinc-500">请输入要引用的{atCategory}名称</span>
          </div>
        )}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={locked ? (lockPlaceholder || "任务执行中，无法输入指令...") : "输入指令，或输入 @ 引用素材，/ 调用技能..."}
          disabled={locked}
          className="relative z-10 w-full bg-transparent border-none focus:ring-0 resize-none px-3 py-2 text-sm font-sans leading-normal text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 min-h-[60px] max-h-[200px] outline-none disabled:opacity-50"
          rows={2}
        />
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
        />
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={locked}
            className="p-1.5 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors disabled:opacity-50"
            title="上传图片"
          >
            <ImageIcon size={16} />
          </button>
          <button
            onClick={() => {
              if (!locked) {
                onChange(value + '@');
                inputRef.current?.focus();
              }
            }}
            disabled={locked}
            className="p-1.5 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors disabled:opacity-50"
            title="引用素材"
          >
            <AtSign size={16} />
          </button>
          <button
            onClick={() => {
              if (!locked) {
                onChange(value + '/');
                inputRef.current?.focus();
              }
            }}
            disabled={locked}
            className="p-1.5 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors disabled:opacity-50"
            title="调用技能"
          >
            <Slash size={16} />
          </button>
        </div>

        {!locked && (
          <button
            onClick={() => {
                if (!locked) {
                    onSubmit(value, images);
                    setImages([]);
                }
            }}
            disabled={!value.trim() && images.length === 0}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white rounded-md transition-colors"
          >
            <Send size={16} />
          </button>
        )}
      </div>

      {/* Popup Menus */}
      <AnimatePresence>
        {isAtActive && !locked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {!atCategory ? (
              activeAtQuery === '' ? (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 dark:border-zinc-700">选择素材类型</div>
                  <div className="p-1">
                    <MenuItem icon={<Users size={14} />} label="人群包" onClick={() => handleCategorySelect('人群包')} />
                    {mode === '圈选模式' && (
                      <MenuItem icon={<Users size={14} />} label="CDP人群包" onClick={() => handleCategorySelect('CDP人群包')} />
                    )}
                    <MenuItem icon={<ImageIcon size={14} />} label="图片" onClick={() => handleCategorySelect('图片')} />
                    <MenuItem icon={<FileText size={14} />} label="小程序卡片" onClick={() => handleCategorySelect('小程序卡片')} />
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 dark:border-zinc-700">搜索素材</div>
                  <div className="p-1 max-h-48 overflow-y-auto">
                    {getAllMockResults(activeAtQuery).map(res => (
                      <MenuItem
                        key={res.id||res.name}
                        icon={getCategoryIcon(res.category)}
                        label={`[${res.category}] ${res.label||res.name}`}
                        onClick={() => insertItem(res.name,res.id)}
                      />
                    ))}
                    {getAllMockResults(activeAtQuery).length === 0 && (
                      <div className="px-3 py-4 text-center text-xs text-zinc-500">无匹配结果</div>
                    )}
                  </div>
                </>
              )
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 dark:border-zinc-700">搜索{atCategory}</div>
                <div className="p-1 max-h-48 overflow-y-auto">
                  {(atCategory==='人群包'&&sessionAudienceOptions?sessionAudienceOptions.filter(a=>a.name.includes(activeAtQuery||'')):getMockResults(atCategory, activeAtQuery || '').map(name=>({id:name,name,label:name}))).map(res => (
                    <MenuItem key={res.id} icon={getCategoryIcon(atCategory)} label={res.label||res.name} onClick={() => insertItem(res.name,atCategory==='人群包'?res.id:undefined)} />
                  ))}
                  {getMockResults(atCategory, activeAtQuery || '').length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-zinc-500">无匹配结果</div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}

        {isSlashActive && !locked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 dark:border-zinc-700">调用技能</div>
            <div className="p-1">
              {mode === '圈选模式' ? (
                <MenuItem icon={<Users size={14} />} label="人群圈选" onClick={() => insertItem('人群圈选')} />
              ) : (
                <>
                  <MenuItem icon={<MessageSquare size={14} />} label="私聊推送" onClick={() => insertItem('私聊推送')} />
                  <MenuItem icon={<Zap size={14} />} label="主动激活内容生成" onClick={() => insertItem('主动激活内容生成')} />
                  <MenuItem icon={<Users size={14} />} label="群聊推送" onClick={() => insertItem('群聊推送')} />
                  <MenuItem icon={<ImageIcon size={14} />} label="朋友圈推送" onClick={() => insertItem('朋友圈推送')} />
                  <MenuItem icon={<FileText size={14} />} label="内容生成" onClick={() => insertItem('内容生成')} />
                  {notifyBAvailable&&<MenuItem icon={<Send size={14} />} label="通知小B" onClick={() => insertItem('通知小B')} />}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, description, onClick }: { key?: string | number, icon: React.ReactNode, label: string, description?: string, onClick: () => void }) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer transition-colors"
      onClick={onClick}
    >
      <span className="text-zinc-400">{icon}</span>
      {description ? (
        <span>
          <span className="block">{label}</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">{description}</span>
        </span>
      ) : label}
    </div>
  );
}

// --- src/components/TaskPlan.tsx ---

function TaskPlan({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        执行计划
      </div>
      <div className="p-3 flex flex-col gap-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2 text-sm"
          >
            <div className="mt-0.5 shrink-0">
              {task.status === 'done' && <CheckCircle2 size={16} className="text-emerald-500" />}
              {task.status === 'loading' && <Loader2 size={16} className="text-indigo-500 animate-spin" />}
              {task.status === 'wait' && <Circle size={16} className="text-zinc-300 dark:text-zinc-600" />}
            </div>
            <span className={`${task.status === 'done' ? 'text-zinc-500 dark:text-zinc-400 line-through decoration-zinc-300 dark:decoration-zinc-600' : 'text-zinc-800 dark:text-zinc-200'}`}>
              {task.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- src/components/MomentsView.tsx ---
interface MomentsViewProps {
    moments: SimMoment[];
    accounts: EnterpriseAccount[];
    selectedMomentId: string | null;
    onSelectMoment: (id: string) => void;
    onOpenProfile: (userId: string) => void;
    onSendMessage: (target: { userId: string; name: string; avatar?: string }) => void;
    filter: 'all' | 'pending';
    tabs?: WorkspaceTab[];
    setTabs?: React.Dispatch<React.SetStateAction<WorkspaceTab[]>>;
    setActiveTabId?: React.Dispatch<React.SetStateAction<string | null>>;
    setActiveModule?: React.Dispatch<React.SetStateAction<string>>;
    customerProfiles?: Record<string, ChatCustomerProfile>;
}

const MomentsView: React.FC<MomentsViewProps> = ({
    moments,
    accounts,
    selectedMomentId,
    onSelectMoment,
    onOpenProfile,
    onSendMessage,
    filter,
    tabs,
    setTabs,
    setActiveTabId,
    setActiveModule,
    customerProfiles
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, userId: string, name: string, avatar?: string } | null>(null);
    const [selectedLikers, setSelectedLikers] = useState<string[]>([]);
    const [replyingTo, setReplyingTo] = useState<{ accountId: string, commentId: string, userName: string, replyToId: string } | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [myLikes, setMyLikes] = useState<Record<string, boolean>>({});
    const [myComments, setMyComments] = useState<Record<string, string[]>>({});
    const [replyingToGroupId, setReplyingToGroupId] = useState<string | null>(null);
    const [groupReplyContent, setGroupReplyContent] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<{ userId: string, name: string, avatar?: string } | null>(null);
    const [activeCustomerPanelTab, setActiveCustomerPanelTab] = useState<'客户档案' | '客户画像' | '客户行为'>('客户档案');
    const [selectedMomentCity, setSelectedMomentCity] = useState('合肥');
    const [momentDateStart, setMomentDateStart] = useState('');
    const [momentDateEnd, setMomentDateEnd] = useState('');
    const [isMomentDateFilterOpen, setIsMomentDateFilterOpen] = useState(false);
    const [groupReplyImage, setGroupReplyImage] = useState<string | null>(null);
    const [replyImage, setReplyImage] = useState<string | null>(null);
    const [isGroupEmojiPickerOpen, setIsGroupEmojiPickerOpen] = useState(false);
    const [isReplyEmojiPickerOpen, setIsReplyEmojiPickerOpen] = useState(false);
    const groupReplyImageInputRef = React.useRef<HTMLInputElement>(null);
    const replyImageInputRef = React.useRef<HTMLInputElement>(null);

    // Batch reply modal states
    const [isBatchReplyOpen, setIsBatchReplyOpen] = useState(false);
    const [batchReplyText, setBatchReplyText] = useState('');
    const [batchReplyImage, setBatchReplyImage] = useState<string | null>(null);
    const [batchReplyMiniProgram, setBatchReplyMiniProgram] = useState<string | null>(null);
    const [isBatchMaterialDropdownOpen, setIsBatchMaterialDropdownOpen] = useState(false);
    const [batchMaterialTab, setBatchMaterialTab] = useState<'图片' | '小程序卡片'>('图片');
    const [batchMaterialQuery, setBatchMaterialQuery] = useState('');
    const [isLikesExpanded, setIsLikesExpanded] = useState(false);
    const [isFrequentLikesExpanded, setIsFrequentLikesExpanded] = useState(false);

    // Added for new features
    const [commentSortBy, setCommentSortBy] = useState<'time' | 'heat'>('time');
    const [hoveredAccountId, setHoveredAccountId] = useState<string | null>(null);
    const [selectedCommentAccountId, setSelectedCommentAccountId] = useState<string | null>(null);
    const [expandedContents, setExpandedContents] = useState<Record<string, boolean>>({});
    const [contentOverflowMap, setContentOverflowMap] = useState<Record<string, boolean>>({});
    const [processedMomentGroups, setProcessedMomentGroups] = useState<Record<string, boolean>>({});
    const [copiedMomentGroupId, setCopiedMomentGroupId] = useState<string | null>(null);
    const contentRefs = React.useRef<Record<string, HTMLParagraphElement | null>>({});

    // Custom hook to manage mock state updates for moments
    const [mockMomentsState, setMockMomentsState] = useState<SimMoment[]>(moments);

    // Sync when props change (e.g. filter changes, though usually we want to preserve local state in this mock)
    useEffect(() => {
        // Only initialize once or when switching completely new datasets
        // For this mock, we'll keep local state priority unless moments array length drastically changes
        if (moments.length !== mockMomentsState.length) {
            setMockMomentsState(moments);
        }
    }, [moments]);

    const isEnterpriseUserId = (userId?: string | null) => !!userId && (userId === 'me' || accounts.some(a => a.id === userId));
    const getEnterpriseAvatar = (userId: string | null | undefined, fallbackAvatar?: string) => {
        if (!userId) return fallbackAvatar;
        if (userId === 'me') return accounts[0]?.avatar || fallbackAvatar;
        const acc = accounts.find(a => a.id === userId);
        return acc?.avatar || fallbackAvatar;
    };
    const getEnterpriseDisplayName = (userId?: string | null, fallbackName?: string) => {
        if (userId === 'me') return accounts[0]?.name || fallbackName || '我';
        const acc = accounts.find(a => a.id === userId);
        return acc?.name || fallbackName || '';
    };
    const renderEnterpriseName = (
        userId: string | null | undefined,
        fallbackName: string,
        textClassName = '',
        badgeClassName = ''
    ) => {
        const displayName = getEnterpriseDisplayName(userId, fallbackName);
        if (!isEnterpriseUserId(userId)) {
            return <span className={textClassName}>{displayName}</span>;
        }
        return (
            <span className="inline-flex items-baseline gap-0.5 min-w-0 max-w-full">
                <span className={textClassName}>{displayName}</span>
                <span className={`shrink-0 text-[#fb923c] ${badgeClassName}`}>@365淘房</span>
            </span>
        );
    };

    const copyMomentGroupId = async (groupId: string) => {
        try {
            await navigator.clipboard.writeText(groupId);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = groupId;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setCopiedMomentGroupId(groupId);
        window.setTimeout(() => {
            setCopiedMomentGroupId(current => current === groupId ? null : current);
        }, 1400);
    };

    const handleContextMenu = (e: React.MouseEvent, userId: string, name: string, avatar?: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, userId, name, avatar });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleMarkGroupProcessed = (groupId: string) => {
        setProcessedMomentGroups(prev => ({ ...prev, [groupId]: true }));
    };

    const handleAddGroupComment = (content: string, text: string, image?: string | null) => {
        if (!text.trim() && !image) return;
        setMockMomentsState(prev => prev.map(m => {
            if (m.content === content) {
                // Use the account name of the moment's creator if available, otherwise fallback to generic
                const account = accounts.find(a => a.id === m.accountId);
                const userName = account ? account.name : '365淘房官方号';
                const userAvatar = account ? account.avatar : 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Official&background=0D8ABC&color=fff';

                const newComment = {
                    id: `c-me-${Date.now()}-${Math.random()}`,
                    userId: account ? account.id : 'me', // Use account ID to integrate properly
                    name: userName,
                    avatar: userAvatar,
                    content: text.trim(),
                    image: image || undefined,
                    time: '刚刚'
                };
                return { ...m, comments: [...(m.comments || []), newComment] };
            }
            return m;
        }));
        setGroupReplyContent('');

        setReplyingToGroupId(null);
    };

    const handleAddReply = (momentId: string, replyToId: string, replyToName: string, text: string, image?: string | null) => {
        if (!text.trim() && !image) return;
        setMockMomentsState(prev => prev.map(m => {
            if (m.id === momentId) {
                const account = accounts.find(a => a.id === m.accountId);
                const userName = account ? account.name : '365淘房官方号';
                const userAvatar = account ? account.avatar : 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Official&background=0D8ABC&color=fff';

                const newComment = {
                    id: `c-me-${Date.now()}-${Math.random()}`,
                    userId: account ? account.id : 'me',
                    name: userName,
                    avatar: userAvatar,
                    content: text.trim(),
                    image: image || undefined,
                    time: '刚刚',
                    replyToId,
                    replyToName
                };
                return { ...m, comments: [...(m.comments || []), newComment] };
            }
            return m;
        }));
        setReplyingTo(null);
        setReplyContent('');

    };

    const parseDateTime = (value: string) => {
        const date = new Date(value.replace(/-/g, '/'));
        return Number.isNaN(date.getTime()) ? new Date() : date;
    };

    const formatMomentLeftDate = (value: string) => {
        const date = parseDateTime(value);
        return {
            day: String(date.getDate()).padStart(2, '0'),
            month: `${date.getMonth() + 1}月`
        };
    };

    const formatMomentFullTime = (value: string) => {
        const date = parseDateTime(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const getDisplayedCommentCountForMoments = React.useCallback((momentsForCount: SimMoment[]) => {
        let total = 0;
        momentsForCount.forEach(moment => {
            const momentComments = moment.comments || [];
            const rootComments = momentComments.filter(comment => !comment.replyToId);
            rootComments.forEach(root => {
                const rootIsEnterprise = isEnterpriseUserId(root.userId);
                const replies = momentComments.filter(comment => comment.replyToId === root.userId);
                const hasCustomerReply = replies.some(reply => !isEnterpriseUserId(reply.userId));
                if (rootIsEnterprise && !hasCustomerReply) {
                    return;
                }
                total += 1 + replies.length;
            });
        });
        return total;
    }, [accounts]);

    // Group moments by content
    const groupedMoments = React.useMemo(() => {
        const groups: {
            content: string;
            groupId: string;
            moments: SimMoment[];
            latestTime: string;
            media: any[];
            publisherAccounts: EnterpriseAccount[];
            pendingLikesCount: number;
            pendingCommentsCount: number;
            dateKey: string;
        }[] = [];
        const seenGroupIds = new Set<string>();
        const isCompanyUser = (userId: string) => accounts.some(a => a.id === userId) || userId === 'me';

        mockMomentsState.forEach(m => {
            if (seenGroupIds.has(m.groupId)) return;
            seenGroupIds.add(m.groupId);

            const related = mockMomentsState.filter(rm => rm.groupId === m.groupId);
            const sortedRelated = [...related].sort((a, b) => parseDateTime(b.time).getTime() - parseDateTime(a.time).getTime());
            const latestMoment = sortedRelated[0];
            const pendingCommentsCount = getDisplayedCommentCountForMoments(related);

            const pendingLikesCount = Array.from(new Map(
                related
                    .flatMap(momentItem => momentItem.likes || [])
                    .filter(like => !isCompanyUser(like.userId))
                    .map(like => [like.userId, like])
            ).values()).length;

            const publisherAccounts = Array.from(new Map(
                related
                    .map(momentItem => accounts.find(acc => acc.id === momentItem.accountId))
                    .filter(Boolean)
                    .map(acc => [acc!.id, acc!])
            ).values());

            const groupItem = {
                content: latestMoment.content,
                groupId: latestMoment.groupId,
                moments: related,
                latestTime: latestMoment.time,
                media: latestMoment.media,
                publisherAccounts,
                pendingLikesCount,
                pendingCommentsCount,
                dateKey: formatMomentFullTime(latestMoment.time).slice(0, 10)
            };

            const matchCity = selectedMomentCity === '全部' || groupItem.publisherAccounts.some(account => account.city === selectedMomentCity);
            const hasPendingInteractions = groupItem.pendingLikesCount > 0 || groupItem.pendingCommentsCount > 0;
            const shouldShowInCurrentFilter = filter === 'all' || (hasPendingInteractions && !processedMomentGroups[groupItem.groupId]);

            if (matchCity && shouldShowInCurrentFilter) {
                groups.push(groupItem);
            }
        });

        const sortedGroups = groups.sort((a, b) => parseDateTime(b.latestTime).getTime() - parseDateTime(a.latestTime).getTime());
        return filterMomentGroupsByDateRange(sortedGroups, momentDateStart, momentDateEnd);
    }, [mockMomentsState, filter, accounts, selectedMomentCity, momentDateStart, momentDateEnd, getDisplayedCommentCountForMoments, processedMomentGroups]);

    useEffect(() => {
        const nextOverflowMap: Record<string, boolean> = {};

        groupedMoments.forEach(group => {
            const element = contentRefs.current[group.groupId];
            if (!element || element.clientWidth === 0) return;

            const computedStyle = window.getComputedStyle(element);
            const clone = element.cloneNode(true) as HTMLParagraphElement;
            clone.style.position = 'fixed';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.visibility = 'hidden';
            clone.style.pointerEvents = 'none';
            clone.style.width = `${element.clientWidth}px`;
            clone.style.display = 'block';
            clone.style.webkitLineClamp = 'unset';
            clone.style.webkitBoxOrient = 'unset';
            clone.style.overflow = 'visible';
            clone.style.maxHeight = 'none';
            clone.style.whiteSpace = 'normal';

            document.body.appendChild(clone);

            const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.5;
            const maxFiveLinesHeight = lineHeight * 5 + 1;
            nextOverflowMap[group.groupId] = clone.scrollHeight > maxFiveLinesHeight;

            document.body.removeChild(clone);
        });

        setContentOverflowMap(nextOverflowMap);
    }, [groupedMoments]);

    const selectedMoment = mockMomentsState.find(m => m.id === selectedMomentId);
    useEffect(() => {
        if (!groupedMoments.length) return;
        const selectedMomentStillVisible = groupedMoments.some(group =>
            group.moments.some(moment => moment.id === selectedMomentId)
        );
        if (!selectedMomentId || !selectedMomentStillVisible) {
            onSelectMoment(groupedMoments[0].moments[0].id);
        }
    }, [groupedMoments, selectedMomentId, onSelectMoment]);

    const selectedContent = selectedMoment?.content;
    const relatedMoments = React.useMemo(() => {
        if (!selectedContent) return [];
        return mockMomentsState.filter(m => m.content === selectedContent);
    }, [selectedContent, mockMomentsState]);

    const aggregatedLikes = React.useMemo(() => {
        const likes: MomentLike[] = [];
        const seenUserIds = new Set<string>();
        relatedMoments.forEach(m => {
            m.likes?.forEach(like => {
                if (isEnterpriseUserId(like.userId)) return;
                if (!seenUserIds.has(like.userId)) {
                    seenUserIds.add(like.userId);
                    likes.push(like);
                }
            });
        });
        return likes;
    }, [relatedMoments, accounts]);

    const aggregatedComments = React.useMemo(() => {
        const comments: MomentComment[] = [];
        relatedMoments.forEach(m => {
            m.comments?.forEach(c => {
                // Assuming company authors are enterprise accounts or have specific IDs
                const isCompany = accounts.some(a => a.id === c.userId) || c.userId === 'me';
                if (!isCompany) {
                    comments.push(c);
                }
            });
        });
        return comments;
    }, [relatedMoments, accounts]);

    // Check if user has commented
    const hasCommented = (userId: string) => {
        return aggregatedComments.some(c => c.userId === userId);
    };

    const uncommentedLikers = aggregatedLikes.filter(l => !hasCommented(l.userId)).map(l => l.userId);
    const defaultLikesPreviewCount = 7;
    const recentLikeCounts = React.useMemo<Record<string, number>>(() => ({
        c_hf_l2: 4,
        c_hf_l5: 3,
        c_hf_l12: 6,
        c_hf_l18: 5
    }), []);
    const likeTiers = React.useMemo(() => (
        buildMomentsLikeTiers(aggregatedLikes, recentLikeCounts, [], 3)
    ), [aggregatedLikes, recentLikeCounts]);
    const priorityLikes = likeTiers.priorityLikes;
    const frequentLikes = likeTiers.frequentLikes;
    const allSelectableLikeIds = React.useMemo(
        () => [...priorityLikes, ...frequentLikes].map(like => like.userId),
        [priorityLikes, frequentLikes]
    );
    const uncommentedLikersInAllTiers = React.useMemo(
        () => [...priorityLikes, ...frequentLikes].filter(l => !hasCommented(l.userId)).map(l => l.userId),
        [priorityLikes, frequentLikes, aggregatedComments]
    );
    const selectedFrequentLikerCount = frequentLikes.filter(like => selectedLikers.includes(like.userId)).length;
    const displayedPriorityLikes = isLikesExpanded ? priorityLikes : priorityLikes.slice(0, defaultLikesPreviewCount);
    const displayedFrequentLikes = isFrequentLikesExpanded ? frequentLikes : [];

    const commentThreads = React.useMemo(() => {
        const threads: { id: string, momentId: string, rootComment: MomentComment, replies: MomentComment[], account?: EnterpriseAccount }[] = [];

        relatedMoments.forEach(m => {
            const account = accounts.find(a => a.id === m.accountId);
            const momentComments = m.comments || [];

            // Customers who commented (assuming non-account users are customers)
            // We treat comments from non-accounts, OR comments without a replyToId as roots.
            const rootComments = momentComments.filter(c => {
                const isAccount = accounts.some(a => a.id === c.userId) || c.userId === 'me';
                // A comment is a root if it's from a customer AND has no replyToId (or if we treat all customer comments as roots to catch bugs, but normally !c.replyToId)
                // Wait, if a customer replies to an employee? Let's just say a root is ANY comment that has no replyToId.
                return !c.replyToId;
            });

            rootComments.forEach(root => {
                const isAccount = accounts.some(a => a.id === root.userId) || root.userId === 'me';

                // For a given root comment, find its replies.
                // If it's a customer root, replies are comments that have replyToId === root.userId
                // If it's an employee root, same thing.
                const replies = momentComments.filter(c => c.replyToId === root.userId);

                // Hide enterprise-only self comments; keep them only when customers join the thread.
                const hasCustomerReply = replies.some(reply => !isEnterpriseUserId(reply.userId));
                if (isAccount && !hasCustomerReply) {
                    return;
                }

                threads.push({
                    id: `${m.id}-${root.id}`,
                    momentId: m.id,
                    rootComment: root,
                    replies: replies,
                    account: account
                });
            });
        });

        return threads;
    }, [relatedMoments, accounts]);

    const sortedCommentThreads = React.useMemo(() => {
        const parseTime = (timeStr: string) => {
            if (!timeStr || timeStr === '刚刚') return 0; // '刚刚' -> 0 (most recent)
            if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(timeStr)) {
                return parseDateTime(timeStr).getTime();
            }
            const match = timeStr.match(/([\d.]+)/);
            const val = match ? parseFloat(match[1]) : 0;
            if (timeStr.includes('分钟')) return val * 60;
            if (timeStr.includes('小时')) return val * 3600;
            if (timeStr.includes('天')) return val * 86400;
            return 0;
        };

        return [...commentThreads].sort((a, b) => {
            const getLatestTime = (thread: typeof a) => {
                const times = [parseTime(thread.rootComment.time), ...thread.replies.map(r => parseTime(r.time))];
                return Math.max(...times);
            };
            return getLatestTime(b) - getLatestTime(a);
        });
    }, [commentThreads, commentSortBy]);

    const commentAccountOptions = React.useMemo(() => {
        const seen = new Set<string>();
        return sortedCommentThreads.reduce<EnterpriseAccount[]>((list, thread) => {
            if (!thread.account || seen.has(thread.account.id)) return list;
            seen.add(thread.account.id);
            list.push(thread.account);
            return list;
        }, []);
    }, [sortedCommentThreads]);

    useEffect(() => {
        if (selectedCommentAccountId && !commentAccountOptions.some(acc => acc.id === selectedCommentAccountId)) {
            setSelectedCommentAccountId(null);
        }
    }, [commentAccountOptions, selectedCommentAccountId]);

    useEffect(() => {
        setSelectedLikers(prev => prev.filter(userId => allSelectableLikeIds.includes(userId)));
    }, [allSelectableLikeIds]);

    useEffect(() => {
        setIsLikesExpanded(false);
        setIsFrequentLikesExpanded(false);
    }, [selectedContent]);

    const filteredCommentThreads = React.useMemo(() => {
        if (!selectedCommentAccountId) return sortedCommentThreads;
        return sortedCommentThreads.filter(thread => thread.account?.id === selectedCommentAccountId);
    }, [sortedCommentThreads, selectedCommentAccountId]);

    const totalCommentCount = React.useMemo(
        () => commentThreads.reduce((acc, thread) => acc + 1 + thread.replies.length, 0),
        [commentThreads]
    );

    const visibleCommentCount = React.useMemo(
        () => filteredCommentThreads.reduce((acc, thread) => acc + 1 + thread.replies.length, 0),
        [filteredCommentThreads]
    );

    const openCustomerPanel = (userId: string, name: string, avatar?: string) => {
        setSelectedCustomer({ userId, name, avatar });
        setActiveCustomerPanelTab('客户档案');
    };

    const selectedCustomerProfile = React.useMemo(() => {
        if (!selectedCustomer) return null;
        const profile = Object.values(customerProfiles || {}).find(item => (
            item.id788 === selectedCustomer.userId || item.name === selectedCustomer.name
        ));
        return profile || {
            name: selectedCustomer.name,
            source: '微信',
            status: '已跟进',
            subtitle: '正常用户',
            phone: '135****0000',
            baseId: '576506933939630400',
            unionid: 'obS_rtQh4CcTdM8QJi0...',
            id788: selectedCustomer.userId,
            ch: 'ch**00',
            friendAddedAt: '2026-05-06 10:42:07',
            abnormalTag: null,
            isBlacklisted: false,
            blacklistReason: '',
            receptionStatus: 'AI'
        };
    }, [selectedCustomer, customerProfiles]);

    const customerPanelTabs = ['客户档案', '客户画像', '客户行为'] as const;
    const customerArchiveFields = selectedCustomerProfile ? [
        { label: '意向区域', value: '梁溪区，民丰板块，新桥花园，新吴区，江溪板块，国信世家溪园，山北板块，城西花园，北大街，大华锦绣城，世茂首府，前进花园，曹巷板块，凤宾家园', tag: '固定', time: '2026-05-06 10:11:26' },
        { label: '意向购房面积/户型', value: '134.18平，3室2厅2卫，136.71平，带院子+阳光房，128.06平，3房2厅2卫，140平，142.46平，3房2厅2卫，大平层，127平，3房，124平', tag: '固定', time: '2026-05-06 10:11:26' },
        { label: '装修状态偏好', value: '毛坯，精装', tag: '固定', time: '2026-03-10 10:57:21' },
        { label: '物业偏好', value: '住宅', tag: '固定', time: '2026-02-25 13:37:24' },
        { label: '用户交易偏好', value: '买房', tag: '固定', time: '2025-12-04 11:52:19' }
    ] : [];
    const customerPortraitBaseInfo = selectedCustomerProfile ? [
        { label: '手机号码', value: selectedCustomerProfile.phone || '189****8666', copyable: true },
        { label: 'base_id', value: selectedCustomerProfile.baseId || '172952193421911697', copyable: true },
        { label: 'unionid', value: selectedCustomerProfile.unionid || 'obS_rt2d_NDALZvQRS...', copyable: true },
        { label: '788ID', value: selectedCustomerProfile.id788 || selectedCustomer?.userId || '7881299921083644', copyable: true },
        { label: '添加好友时间', value: selectedCustomerProfile.friendAddedAt || '2026-05-06 10:42:07', copyable: false },
        { label: '语义手机号(2)', value: '139****8666', copyable: false }
    ] : [];
    const customerPortraitTagGroups = [
        { title: '语料识别-总价偏好', tags: ['150万-200万'] },
        { title: '语料识别-新房板块偏好', tags: ['无锡-梁溪区-火车站'] },
        { title: '语料识别-面积偏好', tags: ['120-140㎡', '140-160㎡'] },
        { title: '语料识别-业务偏好', tags: ['新房', '二手房'] },
        { title: 'CDP标签', tags: ['新房_总价偏好_300-350万元', '板块偏好_府南-wx-480-93，砺成-wx-420-52', '业务偏好_新房'] }
    ];
    const customerFollowupNotes = [
        { time: '2026-05-05 15:14:30', content: '5.5朋友圈前进花园' },
        { time: '2026-05-02 14:58:47', content: '5.2朋友圈蔚蓝观邸' }
    ];
    const customerBehaviorItems = selectedCustomerProfile ? [
        { title: '页面浏览-特价房列表-13秒', time: '2026-04-06 10:31:49', desc: '吉宝季景铭邸，141.0万-490.0万/98.0㎡-265.0㎡' },
        { title: '页面浏览-楼盘详情页-6秒', time: '2026-04-03 23:45:37', desc: '深巷壹号，新吴区/工博园，48.0万-124.0万/44.0㎡-106.0㎡' },
        { title: '页面浏览-特价房列表-3秒', time: '2026-04-03 23:45:30', desc: '深巷壹号，48.0万-124.0万/44.0㎡-106.0㎡' },
        { title: '点击咨询-新房-特价房列表', time: '2026-04-03 23:45:12', desc: '深巷壹号' },
        { title: '页面浏览-特价房列表-9秒', time: '2026-03-27 23:13:45', desc: '长江国际，60.0万-160.0万/47.0㎡-155.0㎡' }
    ] : [];

    const renderContent = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+|#小程序:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part.startsWith('#') ? '#' : part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#576b95] hover:opacity-80 transition-opacity break-all"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const readImageAsDataUrl = (file: File, onLoad: (result: string) => void) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (typeof ev.target?.result === 'string') {
                onLoad(ev.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const appendEmoji = (setter: React.Dispatch<React.SetStateAction<string>>, emoji: string) => {
        setter(prev => `${prev}${emoji}`);
    };

    const momentEmojiList = ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '🤔', '😭', '😎', '👍', '🙏', '🎉', '❤️', '🔥', '🏠'];

    const getCommentSortValue = (time: string) => {
        if (!time || time === '刚刚') return Date.now();
        if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(time)) {
            return parseDateTime(time).getTime();
        }
        const match = time.match(/([\d.]+)/);
        const value = match ? parseFloat(match[1]) : 0;
        if (time.includes('分钟')) return Date.now() - value * 60 * 1000;
        if (time.includes('小时')) return Date.now() - value * 3600 * 1000;
        if (time.includes('天')) return Date.now() - value * 86400 * 1000;
        return 0;
    };

    const getLikeDisplayName = (like: MomentLikeWithFrequency) => {
        if (like.userId === 'me') return accounts[0]?.name || '我';
        const acc = accounts.find(a => a.id === like.userId);
        return acc?.name || like.name;
    };

    const getLikeDisplayAvatar = (like: MomentLikeWithFrequency) => {
        if (like.userId === 'me') return accounts[0]?.avatar;
        const acc = accounts.find(a => a.id === like.userId);
        return acc?.avatar || like.avatar;
    };

    const renderLikeSectionInfo = (testId: string, titleText: string, description: string) => (
        <span className="relative group inline-flex">
            <button
                type="button"
                data-testid={testId}
                title={description}
                className="w-[18px] h-[18px] rounded-full border border-[#b8d7ff] bg-[#f1f7ff] text-[#1683ff] text-[12px] leading-[16px] flex items-center justify-center hover:bg-[#e5f1ff] transition-colors"
            >
                ?
            </button>
            <span className="pointer-events-none absolute left-1/2 top-6 z-30 hidden w-64 -translate-x-1/2 rounded-lg border border-[#b8d7ff] bg-white px-3 py-2 text-left text-xs leading-5 text-[#5f7892] shadow-lg group-hover:block">
                <span className="block font-semibold text-[#31506f] mb-1">{titleText}</span>
                {description}
            </span>
        </span>
    );

    const renderLikeCard = (like: MomentLikeWithFrequency, showRecentLikeCount = false) => {
        const displayName = getLikeDisplayName(like);
        const displayAvatar = getLikeDisplayAvatar(like);
        return (
            <div key={like.userId} className="flex flex-col items-center gap-2 relative">
                <div className="absolute top-1 right-1 z-10 bg-white/90 backdrop-blur-sm rounded-md flex items-center justify-center w-6 h-6 shadow-sm border border-[#d8e5f4]">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#cfe0f5] text-[#1683ff] focus:ring-[#1683ff] shadow-sm cursor-pointer"
                        checked={selectedLikers.includes(like.userId)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedLikers(prev => prev.includes(like.userId) ? prev : [...prev, like.userId]);
                            } else {
                                setSelectedLikers(prev => prev.filter(id => id !== like.userId));
                            }
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => openCustomerPanel(like.userId, displayName, displayAvatar)}
                    onContextMenu={(e) => handleContextMenu(e, like.userId, displayName, displayAvatar)}
                    className="group relative inline-block cursor-pointer mb-0.5"
                >
                    <img src={displayAvatar} referrerPolicy="no-referrer" className="w-14 h-14 rounded-md border border-[#d8e5f4] shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-200 object-cover" alt="" />
                    {hasCommented(like.userId) && (
                        <div className="absolute -bottom-1.5 -right-1.5 bg-white text-[#1683ff] rounded-full p-1 border border-[#c9e3ff] shadow-sm" title="已回评论">
                            <MessageCircle size={12} className="fill-[#e8f4ff] stroke-[#1683ff]" />
                        </div>
                    )}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openCustomerPanel(like.userId, displayName, displayAvatar);
                    }}
                    className="text-[13px] text-[#31506f] font-semibold w-full text-center hover:text-[#1683ff] transition-colors break-words whitespace-normal leading-5"
                >
                    {renderEnterpriseName(like.userId, displayName, 'break-words whitespace-normal', 'text-[13px]')}
                </button>
                {showRecentLikeCount && Boolean(like.recentLikeCount) && (
                    <span className="rounded-full border border-[#d2e6ff] bg-[#edf5ff] px-2 py-0.5 text-[11px] leading-4 text-[#5f7892]">
                        近3天点赞{like.recentLikeCount}次
                    </span>
                )}
            </div>
        );
    };

    return (
        <div
            className="flex h-full w-full overflow-hidden bg-[#eaf4ff]"
            onClick={() => {
                closeContextMenu();
                setIsMomentDateFilterOpen(false);
            }}
        >
            {/* 3rd Column: Moments List */}
            <div className="w-[540px] min-w-[540px] border-r border-[#dbe8f7] flex flex-col bg-[#edf6ff] overflow-x-hidden">
                <div className="px-6 py-4 border-b border-[#dbe8f7] bg-[#f8fbff]">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-[#102a4c] flex items-center gap-2">
                            <Compass size={16} className="text-[#1683ff]" />
                            朋友圈动态
                        </h3>
                        <div className="flex items-center gap-2">
                            <div
                                data-testid="moments-date-range-filter"
                                className="relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    data-testid="moments-date-filter-trigger"
                                    onClick={() => setIsMomentDateFilterOpen(prev => !prev)}
                                    className="h-8 min-w-[164px] rounded-md border border-[#cfe0f5] bg-white px-2.5 text-xs text-[#31506f] shadow-sm flex items-center justify-between gap-2 hover:border-[#8ec5ff] hover:text-[#1683ff]"
                                >
                                    <span className="truncate">{getMomentDateRangeLabel(momentDateStart, momentDateEnd)}</span>
                                    <ChevronDown size={14} className={`shrink-0 text-[#7fa6ca] transition-transform ${isMomentDateFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isMomentDateFilterOpen && (
                                    <div
                                        data-testid="moments-date-filter-panel"
                                        className="absolute right-0 top-10 z-30 w-[318px] rounded-xl border border-[#cfe0f5] bg-white p-3 shadow-xl"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-[#31506f]">选择发布日期</span>
                                            {(momentDateStart || momentDateEnd) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMomentDateStart('');
                                                        setMomentDateEnd('');
                                                    }}
                                                    className="rounded-full px-2 py-0.5 text-[11px] text-[#7fa6ca] hover:bg-[#eef7ff] hover:text-[#1683ff]"
                                                >
                                                    清空
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                            <input
                                                type="date"
                                                aria-label="朋友圈开始日期"
                                                min={MOMENT_DATE_FILTER_MIN}
                                                max={momentDateEnd || MOMENT_DATE_FILTER_TODAY}
                                                value={momentDateStart}
                                                onChange={(e) => setMomentDateStart(e.target.value)}
                                                onClick={(e) => (e.currentTarget as HTMLInputElement & { showPicker?: () => void }).showPicker?.()}
                                                className="h-9 min-w-0 cursor-pointer rounded-md border border-[#dbe8f7] bg-[#f8fbff] px-2 text-xs text-[#31506f] outline-none focus:border-[#5caaff] focus:ring-2 focus:ring-[#b8dcff]/50"
                                            />
                                            <span className="text-[11px] text-[#7fa6ca]">至</span>
                                            <input
                                                type="date"
                                                aria-label="朋友圈结束日期"
                                                min={momentDateStart || MOMENT_DATE_FILTER_MIN}
                                                max={MOMENT_DATE_FILTER_TODAY}
                                                value={momentDateEnd}
                                                onChange={(e) => setMomentDateEnd(e.target.value)}
                                                onClick={(e) => (e.currentTarget as HTMLInputElement & { showPicker?: () => void }).showPicker?.()}
                                                className="h-9 min-w-0 cursor-pointer rounded-md border border-[#dbe8f7] bg-[#f8fbff] px-2 text-xs text-[#31506f] outline-none focus:border-[#5caaff] focus:ring-2 focus:ring-[#b8dcff]/50"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedMomentCity}
                                    onChange={(e) => setSelectedMomentCity(e.target.value)}
                                    className="appearance-none bg-white border border-[#cfe0f5] rounded-md pl-3 pr-8 py-1.5 text-xs text-[#31506f] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b8dcff] focus:border-[#5caaff]"
                                >
                                    {['南京', '无锡', '苏州', '合肥', '芜湖', '西安'].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7fa6ca] pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
                    <AnimatePresence initial={false}>
                    {groupedMoments.map((group) => {
                        const isActive = selectedMoment?.content === group.content;
                        const leftDate = formatMomentLeftDate(group.latestTime);
                        const visiblePublisherAccounts = group.publisherAccounts.slice(0, 1);
                        const publisherSuffix = group.publisherAccounts.length > 1
                            ? `等${group.publisherAccounts.length}个账号发布`
                            : '发布';
                        return (
                            <motion.div
                                key={group.groupId}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.18 }}
                            >
                                <div className="flex gap-3 items-start">
                                    <div className="w-[56px] shrink-0 pt-2 text-right">
                                        <div className="text-[30px] leading-none font-bold text-[#102a4c]">{leftDate.day}</div>
                                        <div className="text-[14px] text-[#31506f] mt-1">{leftDate.month}</div>
                                        {filter === 'pending' && (group.pendingLikesCount > 0 || group.pendingCommentsCount > 0) && (
                                            <div className="mt-2 flex flex-col items-end gap-1">
                                                {group.pendingLikesCount > 0 && (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#ff4d4f] border border-[#ffd6d9] shadow-sm">
                                                        <Heart size={12} className="fill-current" />
                                                        <span className="text-[12px] font-bold leading-none">+{group.pendingLikesCount}</span>
                                                    </div>
                                                )}
                                                {group.pendingCommentsCount > 0 && (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#1683ff] border border-[#c9e3ff] shadow-sm">
                                                        <MessageCircle size={12} />
                                                        <span className="text-[12px] font-bold leading-none">+{group.pendingCommentsCount}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        onClick={() => {
                                            onSelectMoment(group.moments[0].id);
                                        }}
                                        className={`flex-1 min-w-0 text-left p-4 rounded-xl transition-all duration-200 group cursor-pointer bg-white border border-[#d8e5f4]
                                            ${isActive
                                                ? 'shadow-[0_8px_24px_rgba(22,131,255,0.18)] ring-2 ring-[#1683ff] border-[#1683ff]'
                                                : 'hover:shadow-[0_6px_18px_rgba(16,42,76,0.08)] hover:border-[#bcd5ef]'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="relative min-w-0 group/publisher">
                                                <div className="flex items-baseline gap-1 min-w-0 max-w-[340px] whitespace-nowrap overflow-hidden">
                                                    {visiblePublisherAccounts.map((account) => (
                                                        <span key={account.id} className="inline-flex items-baseline gap-0.5 min-w-0 overflow-hidden">
                                                            <span className="truncate min-w-0 text-[14px] leading-5 font-bold text-[#576b95]">
                                                                {getEnterpriseDisplayName(account.id, account.name)}
                                                            </span>
                                                            {isEnterpriseUserId(account.id) && (
                                                                <span className="shrink-0 text-[12px] leading-5 text-[#fb923c]">@365淘房</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                    <span className="shrink-0 whitespace-nowrap text-[11px] leading-5 text-[#8ba7c3]">{publisherSuffix}</span>
                                                </div>
                                                <div className="absolute left-0 top-[calc(100%+8px)] hidden group-hover/publisher:block z-20 w-64 bg-white border border-[#d8e5f4] rounded-lg shadow-[0_10px_30px_rgba(16,42,76,0.16)] p-2 max-h-[300px] overflow-y-auto">
                                                    <div className="text-[11px] text-[#8ba7c3] px-2 py-1 sticky top-0 bg-white/90 backdrop-blur-sm z-10">发布账号列表</div>
                                                    {group.publisherAccounts.map(account => (
                                                        <div key={account.id} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#f1f7ff]">
                                                            <img src={account.avatar} className="w-6 h-6 rounded-md border border-[#d8e5f4] shrink-0" alt="" />
                                                            {renderEnterpriseName(account.id, account.name, 'text-xs font-semibold text-[#1683ff] min-w-0 truncate', 'text-[12px]')}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {filter === 'pending' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkGroupProcessed(group.groupId);
                                                        }}
                                                        className="px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center justify-center gap-1 bg-[#e9fbf3] text-[#10a866] hover:bg-[#d9f7e9] transition-colors border border-[#bcebd6]"
                                                    >
                                                        <CheckCircle2 size={13} />
                                                        标记已处理
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="relative mb-3">
                                            <p
                                                ref={(node) => { contentRefs.current[group.groupId] = node; }}
                                                className={`text-[15px] text-[#1f3654] leading-relaxed ${!expandedContents[group.groupId] ? 'line-clamp-5' : ''}`}
                                                title={!expandedContents[group.groupId] ? group.content : undefined}
                                            >
                                                {renderContent(group.content)}
                                            </p>
                                            {contentOverflowMap[group.groupId] && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedContents(prev => ({
                                                            ...prev,
                                                            [group.groupId]: !prev[group.groupId]
                                                        }));
                                                    }}
                                                    className="text-[13px] text-[#1683ff] font-medium mt-1 hover:opacity-80 transition-opacity"
                                                >
                                                    {expandedContents[group.groupId] ? '收起' : '全文'}
                                                </button>
                                            )}
                                        </div>

                                        {group.media.length > 0 && (
                                            <div className="flex flex-wrap gap-1 overflow-hidden rounded-md" onClick={(e) => e.stopPropagation()}>
                                                {group.media.slice(0, expandedContents[group.groupId] ? undefined : 3).map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`relative bg-[#e8f1fb] ${group.media.length === 1 ? 'w-full h-32' : group.media.length === 2 || (expandedContents[group.groupId] && group.media.length === 4) ? 'w-[calc(50%-2px)] aspect-square' : 'w-[calc(33.333%-3px)] aspect-square'}`}
                                                    >
                                                        <img src={item.url} referrerPolicy="no-referrer" className="w-full h-full object-cover rounded cursor-zoom-in" alt="" />
                                                        {(item.type === 'video' || item.type === 'channels') && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                                                                <Play size={20} className="text-white fill-current" />
                                                            </div>
                                                        )}
                                                        {!expandedContents[group.groupId] && idx === 2 && group.media.length > 3 && (
                                                            <div
                                                                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer rounded hover:bg-black/40 transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setExpandedContents(prev => ({
                                                                        ...prev,
                                                                        [group.groupId]: true
                                                                    }));
                                                                }}
                                                            >
                                                                <span className="text-xl font-bold">+{group.media.length - 3}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-3 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center gap-2 text-[12px] text-[#8ba7c3]">
                                                <span>{formatMomentFullTime(group.latestTime)}</span>
                                                <details
                                                    className="relative"
                                                    onMouseEnter={(e) => { e.currentTarget.open = true; }}
                                                    onMouseLeave={(e) => { e.currentTarget.open = false; }}
                                                >
                                                    <summary
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyMomentGroupId(group.groupId);
                                                        }}
                                                        className="list-none cursor-pointer select-none inline-flex items-center rounded px-1.5 py-0.5 text-[#9ab0c7] hover:text-[#1683ff] hover:bg-[#eef6ff] transition-colors"
                                                    >
                                                        {copiedMomentGroupId === group.groupId ? '已复制' : 'ID'}
                                                    </summary>
                                                    <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-max max-w-[260px] rounded-md border border-[#d8e5f4] bg-white px-2.5 py-2 shadow-[0_8px_24px_rgba(16,42,76,0.14)]">
                                                        <div className="font-mono text-[11px] text-[#31506f] break-all">{group.groupId}</div>
                                                    </div>
                                                </details>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-3 text-[12px] text-[#5f7892]">
                                                <span className="inline-flex items-center gap-1">
                                                <Heart size={13} className="text-[#7d96b2]" />
                                                <span>点赞</span>
                                                <span className="font-semibold text-[#31506f]">{group.pendingLikesCount}</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                <MessageCircle size={13} className="text-[#7d96b2]" />
                                                <span>评论</span>
                                                <span className="font-semibold text-[#31506f]">{group.pendingCommentsCount}</span>
                                                </span>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setReplyingToGroupId(replyingToGroupId === group.content ? null : group.content)}
                                                    className="px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-[#5f7892] bg-white border border-[#d8e5f4] hover:text-[#1683ff] hover:border-[#9acbff] transition-colors"
                                                >
                                                    <MessageCircle size={13} />
                                                    评论
                                                </button>
                                                </div>
                                            </div>

                                            {(() => {
                                                const myRootComments = group.moments
                                                    .flatMap(m => m.comments || [])
                                                    .filter(c => (c.userId === 'me' || accounts.some(a => a.id === c.userId)) && !c.replyToId)
                                                    .sort((a, b) => getCommentSortValue(a.time) - getCommentSortValue(b.time));
                                                if (myRootComments.length === 0) return null;

                                                const groupedByContent: { content: string, image?: string, authors: { id: string, name: string }[], latestOrder: number, latestIndex: number }[] = [];

                                                myRootComments.forEach((c, idx) => {
                                                    const existingGroup = groupedByContent.find(g => g.content === c.content && g.image === c.image);
                                                    if (existingGroup) {
                                                        if (!existingGroup.authors.some(a => a.id === c.userId)) {
                                                            existingGroup.authors.push({ id: c.userId, name: c.name });
                                                        }
                                                        existingGroup.latestOrder = getCommentSortValue(c.time);
                                                        existingGroup.latestIndex = idx;
                                                    } else {
                                                        groupedByContent.push({
                                                            content: c.content,
                                                            image: c.image,
                                                            authors: [{ id: c.userId, name: c.name }],
                                                            latestOrder: getCommentSortValue(c.time),
                                                            latestIndex: idx
                                                        });
                                                    }
                                                });

                                                return (
                                                    <div className="flex flex-col gap-1 mt-2">
                                                        {groupedByContent
                                                            .sort((a, b) => a.latestOrder === b.latestOrder ? a.latestIndex - b.latestIndex : a.latestOrder - b.latestOrder)
                                                            .map((commentGroup, idx) => (
                                                            <div
                                                                key={`content-group-${idx}`}
                                                                className="bg-[#f7fbff] hover:bg-[#f1f7ff] rounded-md p-2.5 text-[13px] text-[#5f7892] break-words whitespace-normal border border-[#d8e5f4] flex items-start gap-1 transition-colors"
                                                            >
                                                                <span className="font-bold text-slate-700 mt-0.5 flex items-center flex-wrap leading-6 min-w-0">
                                                                    <MessageCircle size={14} className="mr-1.5 text-blue-500" />
                                                                    {commentGroup.authors.length > 1 ? (
                                                                        <>
                                                                            {renderEnterpriseName(commentGroup.authors[0].id, commentGroup.authors[0].name, 'text-slate-700', 'text-[13px]')}
                                                                            <span className="text-slate-700">等{commentGroup.authors.length}个账号</span>
                                                                        </>
                                                                    ) : (
                                                                        renderEnterpriseName(commentGroup.authors[0].id, commentGroup.authors[0].name, 'text-slate-700', 'text-[13px]')
                                                                    )}
                                                                    <span>:</span>
                                                                </span>
                                                                <div className="leading-relaxed mt-0.5 min-w-0">
                                                                    {commentGroup.content ? <div>{commentGroup.content}</div> : null}
                                                                    {commentGroup.image && (
                                                                        <img src={commentGroup.image} className="mt-2 w-24 h-24 object-cover rounded-lg border border-slate-200" alt="评论图片" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}

                                            <AnimatePresence>
                                                {replyingToGroupId === group.content && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden mt-2"
                                                    >
                                                       <div className="bg-white border border-[#9acbff] rounded-md p-2.5 shadow-[0_4px_14px_rgba(22,131,255,0.08)]">
                                                           <textarea
                                                             autoFocus
                                                             value={groupReplyContent}
                                                             onChange={e => setGroupReplyContent(e.target.value)}
                                                             placeholder="输入评论内容..."
                                                             className="w-full text-xs bg-transparent outline-none resize-none min-h-[64px] leading-5 placeholder:text-[#9db4ca]"
                                                           />
                                                           <div className="mt-2 flex items-center justify-between gap-2">
                                                               <div className="flex items-center gap-1.5 relative">
                                                                   <button
                                                                       type="button"
                                                                       onClick={() => setIsGroupEmojiPickerOpen(prev => !prev)}
                                                                       className="w-8 h-8 rounded-md border border-[#d8e5f4] bg-white hover:bg-[#f1f7ff] flex items-center justify-center text-[#7d96b2]"
                                                                       title="选择表情"
                                                                   >
                                                                       <Smile size={14} />
                                                                   </button>
                                                                   {isGroupEmojiPickerOpen && (
                                                                       <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-xl p-2">
                                                                           <div className="grid grid-cols-4 gap-1">
                                                                               {momentEmojiList.map(emoji => (
                                                                                   <button
                                                                                       key={emoji}
                                                                                       type="button"
                                                                                       onClick={() => {
                                                                                           appendEmoji(setGroupReplyContent, emoji);
                                                                                           setIsGroupEmojiPickerOpen(false);
                                                                                       }}
                                                                                       className="h-9 rounded-lg hover:bg-slate-100 text-lg flex items-center justify-center"
                                                                                   >
                                                                                       {emoji}
                                                                                   </button>
                                                                               ))}
                                                                           </div>
                                                                       </div>
                                                                   )}

                                                               </div>
                                                               <div className="flex items-center gap-2">
                                                                   <button
                                                                       onClick={() => {
                                                                           setReplyingToGroupId(null);
                                                                           setGroupReplyContent('');

                                                                           setIsGroupEmojiPickerOpen(false);
                                                                       }}
                                                                       className="text-xs text-[#5f7892] hover:text-[#31506f] px-2 py-1"
                                                                   >
                                                                       取消
                                                                   </button>
                                                                   <button
                                                                       disabled={!groupReplyContent.trim()}
                                                                       onClick={() => {
                                                                           handleAddGroupComment(group.content, groupReplyContent, null);
                                                                           setIsGroupEmojiPickerOpen(false);
                                                                       }}
                                                                       className="px-3 py-1.5 flex items-center justify-center gap-1 bg-[#7db8ff] text-white rounded-md text-xs font-bold disabled:opacity-50 hover:bg-[#5aa6ff]"
                                                                   >
                                                                      <Share2 size={12} />
                                                                      发送
                                                                   </button>
                                                               </div>
                                                           </div>
                                                       </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    </AnimatePresence>
                </div>
            </div>

            {/* 4th Column: Moment Detail */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#eaf4ff]">
                {selectedMoment ? (
                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full py-6 px-4">
                            {/* Likes and Comments */}
                            <div>
                                <div className="flex flex-col gap-6">
                                    <div className="rounded-lg border border-[#d8e5f4] bg-white p-4 shadow-[0_1px_2px_rgba(16,42,76,0.04)]">
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Heart size={16} className="text-[#1683ff]" />
                                                <span className="text-[15px] font-bold text-[#102a4c]">点赞区 ({aggregatedLikes.length})</span>
                                            </div>
                                            {allSelectableLikeIds.length > 0 && (
                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 text-sm text-[#5f7892] cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-[#cfe0f5] text-[#1683ff] focus:ring-[#1683ff] cursor-pointer"
                                                            checked={selectedLikers.length === allSelectableLikeIds.length && allSelectableLikeIds.length > 0}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedLikers(allSelectableLikeIds);
                                                                } else {
                                                                    setSelectedLikers([]);
                                                                }
                                                            }}
                                                        />
                                                        全选
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-[#5f7892] cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-[#cfe0f5] text-[#1683ff] focus:ring-[#1683ff] cursor-pointer"
                                                            checked={uncommentedLikersInAllTiers.length > 0 && uncommentedLikersInAllTiers.every(id => selectedLikers.includes(id))}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedLikers(prev => {
                                                                        const next = new Set(prev);
                                                                        uncommentedLikersInAllTiers.forEach(id => next.add(id));
                                                                        return Array.from(next);
                                                                    });
                                                                } else {
                                                                    setSelectedLikers(prev => prev.filter(id => !uncommentedLikersInAllTiers.includes(id)));
                                                                }
                                                            }}
                                                        />
                                                        选择未评论用户
                                                    </label>
                                                    <button
                                                        disabled={selectedLikers.length === 0}
                                                        onClick={() => {
                                                            if (selectedLikers.length > 0) {
                                                                setIsBatchReplyOpen(true);
                                                            }
                                                        }}
                                                        className="bg-[#7db8ff] text-white px-4 py-1.5 rounded-md text-[13px] font-bold shadow-sm hover:bg-[#5aa6ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        私聊回复 {selectedLikers.length > 0 ? `(${selectedLikers.length})` : ''}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-[12px] font-medium text-[#3a7edc]">优先处理</span>
                                                        <span className="text-[12px] text-[#6f86a0]">{priorityLikes.length}人</span>
                                                        {renderLikeSectionInfo(
                                                            'priority-likes-info',
                                                            '优先处理点赞人',
                                                            '当前动态下点赞，且近3个自然日全平台点赞次数未达到3次的用户，建议优先处理。'
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`${isLikesExpanded ? 'min-h-[180px] max-h-[260px] overflow-y-auto' : 'min-h-[120px] max-h-[136px] overflow-hidden'} pr-1`}>
                                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-7 gap-y-5 p-2">
                                                        {priorityLikes.length > 0 ? (
                                                            displayedPriorityLikes.map((like) => renderLikeCard(like))
                                                        ) : (
                                                            <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-300">
                                                                <Heart size={28} strokeWidth={1} className="mb-2" />
                                                                <p className="text-xs">暂无优先处理点赞人</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {priorityLikes.length > defaultLikesPreviewCount && (
                                                        <div className="flex justify-center mt-2 mb-4">
                                                            <button
                                                                onClick={() => setIsLikesExpanded(!isLikesExpanded)}
                                                                className="text-xs text-[#1683ff] hover:text-[#006fe6] flex items-center gap-1"
                                                            >
                                                                {isLikesExpanded ? '收起' : '查看更多'}
                                                                <ChevronDown size={12} className={`transform transition-transform ${isLikesExpanded ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {frequentLikes.length > 0 && (
                                                <div className="border-t border-dashed border-[#e4edf7] pt-3">
                                                    <div className="flex items-center justify-between gap-3 px-1 py-1">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                            <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-[12px] font-medium text-[#3a7edc] shrink-0">近3天点赞3次及以上</span>
                                                            <span className="text-[12px] text-[#6f86a0]">{frequentLikes.length}人</span>
                                                            {renderLikeSectionInfo(
                                                                'frequent-likes-info',
                                                                '近3天点赞3次及以上用户',
                                                                '近3个自然日内全平台点赞次数达到3次及以上的用户，默认收起降低处理优先级；可展开查看并参与勾选、全选、选择未评论用户和批量私聊回复。'
                                                            )}
                                                            {selectedFrequentLikerCount > 0 && (
                                                                <span className="rounded-full bg-[#edf6ff] px-2 py-0.5 text-[12px] text-[#1683ff]">
                                                                    已选{selectedFrequentLikerCount}人
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => setIsFrequentLikesExpanded(prev => !prev)}
                                                            className="shrink-0 text-xs text-[#1683ff] hover:text-[#006fe6] flex items-center gap-1"
                                                        >
                                                            {isFrequentLikesExpanded ? '收起' : '展开'}
                                                            <ChevronDown size={12} className={`transform transition-transform ${isFrequentLikesExpanded ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                    {isFrequentLikesExpanded && (
                                                        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-7 gap-y-5 px-2 pb-1">
                                                            {displayedFrequentLikes.map((like) => renderLikeCard(like, true))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-[#d8e5f4] bg-white p-4 shadow-[0_1px_2px_rgba(16,42,76,0.04)]">
                                        <div className="flex items-center justify-between border-b border-[#e5eef8] pb-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare size={16} className="text-[#1683ff]" />
                                                <span className="text-[15px] font-bold text-[#102a4c]">评论区 ({totalCommentCount})</span>
                                            </div>

                                        </div>

                                        <div className="flex gap-4 min-h-[520px]">
                                            <div className="w-[230px] shrink-0 border-r border-[#e5eef8] pr-3">
                                                <div className="text-[13px] font-bold text-[#5f7892] mb-4 px-1 flex items-center gap-1.5">
                                                    <Compass size={14} className="text-[#1683ff]" /> 发布账号
                                                </div>
                                                <div className="space-y-1.5">
                                                    {commentAccountOptions.map(acc => {
                                                        const isHovered = hoveredAccountId === acc.id;
                                                        const isSelected = selectedCommentAccountId === acc.id;
                                                        return (
                                                            <div
                                                                key={acc.id}
                                                                className={`flex items-center gap-2.5 p-2 rounded-md cursor-pointer transition-colors border
                                                                    ${isSelected ? 'bg-[#e7f3ff] border-[#9acbff] shadow-sm' : isHovered ? 'bg-[#f1f7ff] border-[#d8e5f4]' : 'bg-[#f8fbff] hover:bg-[#f1f7ff] border-transparent'}`}
                                                                onClick={() => setSelectedCommentAccountId(prev => prev === acc.id ? null : acc.id)}
                                                            >
                                                                <img src={acc.avatar} className="w-7 h-7 rounded-md border border-[#d8e5f4]" alt="" />
                                                                {renderEnterpriseName(acc.id, acc.name, `text-[13px] whitespace-nowrap ${isSelected ? 'text-[#1683ff] font-bold' : isHovered ? 'text-[#102a4c] font-semibold' : 'text-[#31506f] font-medium'}`, 'text-[13px]')}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                {filteredCommentThreads.length > 0 ? (
                                                    filteredCommentThreads.map((thread) => (
                                                        <div
                                                            key={thread.id}
                                                            className="bg-white rounded-lg border border-[#d8e5f4] p-4 hover:shadow-[0_4px_16px_rgba(16,42,76,0.08)] transition-shadow scroll-mt-4 relative group/thread"
                                                            onMouseEnter={() => setHoveredAccountId(thread.account?.id || null)}
                                                            onMouseLeave={() => setHoveredAccountId(null)}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openCustomerPanel(thread.rootComment.userId, thread.rootComment.name, thread.rootComment.avatar)}
                                                                        onContextMenu={(e) => handleContextMenu(e, thread.rootComment.userId, thread.rootComment.name, thread.rootComment.avatar)}
                                                                    >
                                                                        <img src={getEnterpriseAvatar(thread.rootComment.userId, thread.rootComment.avatar)} className="w-8 h-8 rounded-full border border-[#e5eef8] object-cover" alt="" />
                                                                    </button>
                                                                    <div>
                                                                    <button
                                                                        onClick={() => openCustomerPanel(thread.rootComment.userId, thread.rootComment.name, thread.rootComment.avatar)}
                                                                        className="text-[14px] font-bold text-[#31506f] hover:text-[#1683ff]"
                                                                    >
                                                                        {renderEnterpriseName(thread.rootComment.userId, thread.rootComment.name, 'text-[14px] font-bold text-[#31506f]', 'text-[14px]')}
                                                                    </button>
                                                                        <div className="text-[11px] text-[#8ba7c3]">{thread.rootComment.time}</div>
                                                                    </div>
                                                                </div>
                                                                {thread.account && (
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#f8fbff] rounded-md border border-[#d8e5f4]">
                                                                        <span className="text-[10px] text-[#8ba7c3]">发布账号:</span>
                                                                        <img src={thread.account.avatar} className="w-4 h-4 rounded-full" alt="" />
                                                                        {renderEnterpriseName(thread.account.id, thread.account.name, 'text-[11px] text-[#5f7892] font-medium', 'text-[11px]')}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="pl-10 text-sm text-[#1f3654] leading-relaxed mb-3">
                                                                {thread.rootComment.content ? <div>{thread.rootComment.content}</div> : null}
                                                                {thread.rootComment.image && (
                                                                    <img src={thread.rootComment.image} className="mt-2 w-28 h-28 object-cover rounded-lg border border-[#d8e5f4]" alt="评论图片" />
                                                                )}
                                                            </div>

                                                            {thread.replies.length > 0 && (
                                                                <div className="ml-10 bg-[#f7fbff] rounded-md p-3 space-y-3 border border-[#e5eef8]">
                                                                    {thread.replies.map(reply => (
                                                                        <div key={reply.id} className="text-sm group/reply relative">
                                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                                <button onClick={() => openCustomerPanel(reply.userId, reply.name, reply.avatar)} className="flex items-center gap-1.5 font-bold text-[#576b95] hover:underline">
                                                                                    <img src={getEnterpriseAvatar(reply.userId, reply.avatar)} className="w-5 h-5 rounded-full border border-slate-100 object-cover" alt="" />
                                                                                    {renderEnterpriseName(reply.userId, reply.name, 'font-bold text-[#576b95]', 'text-sm')}
                                                                                </button>
                                                                                {reply.replyToName && (
                                                                                    <>
                                                                                        <span className="text-slate-400 text-[12px]">回复</span>
                                                                                        <button onClick={() => reply.replyToId && openCustomerPanel(reply.replyToId, reply.replyToName || '客户')} className="flex items-center gap-1.5 font-bold text-[#576b95] hover:underline">
                                                                                            <img src={getEnterpriseAvatar(reply.replyToId, 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=C&background=f1f5f9&color=94a3b8')} className="w-5 h-5 rounded-full border border-slate-100 object-cover" alt="" />
                                                                                            {renderEnterpriseName(reply.replyToId, reply.replyToName || '客户', 'font-bold text-[#576b95]', 'text-sm')}
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                                <span className="text-[11px] text-[#8ba7c3] ml-auto">{reply.time}</span>
                                                                            </div>
                                                                            <div className="text-[#31506f] leading-relaxed pr-10">
                                                                                {reply.content ? <div>{reply.content}</div> : null}
                                                                                {reply.image && (
                                                                                    <img src={reply.image} className="mt-2 w-24 h-24 object-cover rounded-lg border border-[#d8e5f4]" alt="回复图片" />
                                                                                )}
                                                                            </div>
                                                                            {!replyingTo?.commentId && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setReplyingTo({ accountId: thread.account?.id || '', commentId: thread.rootComment.id, userName: reply.name, replyToId: reply.userId });
                                                                                        setReplyContent('');

                                                                                        setIsReplyEmojiPickerOpen(false);
                                                                                    }}
                                                                                    className="absolute bottom-0 right-0 opacity-0 group-hover/reply:opacity-100 text-[12px] text-[#1683ff] hover:text-[#006fe6] flex items-center gap-1 transition-opacity"
                                                                                >
                                                                                    回复
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="mt-2 pl-10 flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    {replyingTo?.commentId === thread.rootComment.id && (
                                                                        <div className="mt-2 flex gap-2 items-start">
                                                                            <div className="flex-1 bg-white border border-[#9acbff] rounded-md p-2 focus-within:border-[#1683ff] transition-colors">
                                                                                <textarea
                                                                                    autoFocus
                                                                                    className="w-full bg-transparent border-none outline-none text-[13px] resize-none min-h-[56px] placeholder:text-[#9db4ca]"
                                                                                    placeholder={`回复 ${replyingTo?.userName}...`}
                                                                                    value={replyContent}
                                                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                                            e.preventDefault();
                                                                                            if ((replyContent.trim() || replyImage) && replyingTo) {
                                                                                                handleAddReply(thread.momentId, replyingTo.replyToId, replyingTo.userName, replyContent, null);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                ></textarea>
                                                                                <div className="flex items-center justify-between gap-2 mt-2">
                                                                                    <div className="flex items-center gap-1.5 relative">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setIsReplyEmojiPickerOpen(prev => !prev)}
                                                                                            className="w-8 h-8 rounded-md border border-[#d8e5f4] bg-[#f8fbff] hover:bg-[#f1f7ff] flex items-center justify-center text-[#7d96b2]"
                                                                                            title="选择表情"
                                                                                        >
                                                                                            <Smile size={14} />
                                                                                        </button>
                                                                                        {isReplyEmojiPickerOpen && (
                                                                                            <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-xl p-2">
                                                                                                <div className="grid grid-cols-4 gap-1">
                                                                                                    {momentEmojiList.map(emoji => (
                                                                                                        <button
                                                                                                            key={emoji}
                                                                                                            type="button"
                                                                                                            onClick={() => {
                                                                                                                appendEmoji(setReplyContent, emoji);
                                                                                                                setIsReplyEmojiPickerOpen(false);
                                                                                                            }}
                                                                                                            className="h-9 rounded-lg hover:bg-slate-100 text-lg flex items-center justify-center"
                                                                                                        >
                                                                                                            {emoji}
                                                                                                        </button>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        )}

                                                                                    </div>
                                                                                    <div className="flex justify-end gap-2">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setReplyingTo(null);
                                                                                            setReplyContent('');

                                                                                            setIsReplyEmojiPickerOpen(false);
                                                                                        }}
                                                                                        className="text-xs text-[#5f7892] hover:text-[#31506f] px-2 py-1"
                                                                                    >
                                                                                        取消
                                                                                    </button>
                                                                                    <button
                                                                                        disabled={!replyContent.trim()}
                                                                                        onClick={() => {
                                                                                            if (replyingTo) {
                                                                                                handleAddReply(thread.momentId, replyingTo.replyToId, replyingTo.userName, replyContent, null);
                                                                                            }
                                                                                            setIsReplyEmojiPickerOpen(false);
                                                                                        }}
                                                                                        className="bg-[#7db8ff] text-white px-3 py-1 rounded-md text-xs font-bold disabled:opacity-50 hover:bg-[#5aa6ff]"
                                                                                    >
                                                                                        发送
                                                                                    </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!replyingTo?.commentId && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setReplyingTo({ accountId: thread.account?.id || '', commentId: thread.rootComment.id, userName: thread.rootComment.name, replyToId: thread.rootComment.userId });
                                                                            setReplyContent('');

                                                                            setIsReplyEmojiPickerOpen(false);
                                                                        }}
                                                                        className="text-xs text-[#1683ff] hover:text-[#006fe6] flex items-center gap-1 transition-colors"
                                                                    >
                                                                        <MessageCircle size={12} /> 回复
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-12 flex flex-col items-center justify-center text-[#b2c5d8]">
                                                        <MessageSquare size={32} strokeWidth={1} className="mb-2" />
                                                        <p className="text-xs">{selectedCommentAccountId ? '当前账号下暂无可展示的评论内容' : '暂无评论'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#eaf4ff]">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-[#d8e5f4]">
                            <Compass size={40} className="text-[#b2c5d8]" />
                        </div>
                        <p className="text-[#7d96b2] font-medium">请选择一条动态查看详情</p>
                    </div>
                )}
            </div>

            {selectedCustomer && selectedCustomerProfile && (
                <div className="w-[320px] border-l border-slate-200 bg-[#f2f3f5] flex flex-col shrink-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
                        <div className="text-sm font-semibold text-slate-800">客户详情</div>
                        <button onClick={() => setSelectedCustomer(null)} className="p-1 rounded hover:bg-slate-100 text-slate-500">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-3 bg-[#f2f3f5] border-b border-slate-200">
                        <div className="grid grid-cols-3 gap-2 text-[13px]">
                            {customerPanelTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveCustomerPanelTab(tab)}
                                    className={`h-9 rounded-sm border transition-colors ${
                                        activeCustomerPanelTab === tab
                                            ? 'bg-white text-[#3b82f6] border-[#93c5fd]'
                                            : 'bg-[#f7f7f8] text-slate-700 border-[#e5e7eb] hover:bg-white'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-[#f2f3f5] p-3">
                        {activeCustomerPanelTab === '客户档案' && (
                            <div>
                                <div className="flex justify-end items-center text-[#3b82f6] text-sm mb-2">
                                    <RefreshCw size={14} className="mr-1" />
                                    刷新
                                </div>
                                <div className="space-y-3">
                                    {customerArchiveFields.map((field, index) => (
                                        <div key={index} className="bg-white rounded-2xl border border-[#ececec] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className="text-sm text-slate-500">{field.label}</span>
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f5] text-slate-500 border border-[#ebebeb]">
                                                    {field.tag}
                                                </span>
                                            </div>
                                            <div className="text-[16px] leading-8 font-semibold text-slate-700">{field.value}</div>
                                            <div className="text-xs text-slate-400 mt-2">{field.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeCustomerPanelTab === '客户画像' && (
                            <div className="relative pb-16">
                                <div className="space-y-3">
                                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {selectedCustomer.avatar ? (
                                                    <img src={selectedCustomer.avatar} className="w-11 h-11 rounded-full object-cover border border-slate-200" alt="" />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                        {selectedCustomer.name.slice(0, 1)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="text-[18px] font-semibold text-slate-800 truncate">{selectedCustomerProfile.name}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-500">在线</span>
                                                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-500">已授权</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className="text-sm font-semibold text-slate-800 mb-4">基础信息</div>
                                        <div className="space-y-3 text-[13px]">
                                            {customerPortraitBaseInfo.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between gap-3">
                                                    <span className="text-slate-500">{item.label}：</span>
                                                    <div className="flex items-center gap-1.5 min-w-0 text-slate-800">
                                                        <span className="truncate">{item.value}</span>
                                                        {item.copyable && <Copy size={13} className="text-slate-400 shrink-0" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className="text-sm font-semibold text-slate-800 mb-4">客户标签</div>
                                        <div className="space-y-3">
                                            {customerPortraitTagGroups.map((group, index) => (
                                                <div key={index}>
                                                    <div className="text-[13px] text-slate-700 mb-2">{group.title}</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {group.tags.map(tag => (
                                                            <span key={tag} className="text-[12px] px-2.5 py-1 rounded-full bg-[#eef2ff] text-[#6366f1]">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {index === customerPortraitTagGroups.length - 1 && selectedCustomerProfile.abnormalTag && (
                                                            <span className="text-[12px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
                                                                {selectedCustomerProfile.abnormalTag}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm font-semibold text-slate-800">跟进备注</div>
                                            <div className="flex items-center gap-3 text-[12px] text-slate-500">
                                                <button className="flex items-center gap-1 hover:text-blue-600">
                                                    <Plus size={12} className="bg-blue-500 text-white rounded-full p-0.5" />
                                                    添加
                                                </button>
                                                <button className="hover:text-blue-600">查看全部</button>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {customerFollowupNotes.map((item, index) => (
                                                <div key={index} className="relative pl-5">
                                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"></div>
                                                    <div className="text-[13px] text-slate-400">{item.time}</div>
                                                    <div className="text-[15px] text-slate-700 mt-1">{item.content}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className="absolute right-1 bottom-0 w-14 h-14 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-lg">
                                    <Bot size={24} />
                                </button>
                            </div>
                        )}

                        {activeCustomerPanelTab === '客户行为' && (
                            <div className="relative pb-16">
                                <div className="space-y-3">
                                    {customerBehaviorItems.map((item, index) => (
                                        <div key={index} className="relative bg-white rounded-xl border border-slate-200 p-4 pl-6">
                                            <div className="absolute left-3 top-5 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"></div>
                                            <div className="text-[13px] text-slate-400">{item.time}</div>
                                            <div className="text-[16px] font-medium text-slate-800 mt-1">{item.title}</div>
                                            <div className="text-[13px] text-slate-500 leading-6 mt-1">{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                <button className="absolute right-1 bottom-0 w-14 h-14 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-lg">
                                    <Bot size={24} />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-[100] bg-white rounded-xl shadow-2xl border border-slate-100 py-1 min-w-[120px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button
                            onClick={() => {
                                onSendMessage({ userId: contextMenu.userId, name: contextMenu.name, avatar: contextMenu.avatar });
                                closeContextMenu();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            <MessageSquare size={14} />
                            发私聊消息
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Batch Reply Modal */}
            <AnimatePresence>
                {isBatchReplyOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-[600px] flex flex-col overflow-hidden"
                        >
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">私聊回复 ({selectedLikers.length}人)</h3>
                                <button
                                    onClick={() => {
                                        setIsBatchReplyOpen(false);
                                        setBatchReplyText('');
                                        setBatchReplyImage(null);
                                        setBatchReplyMiniProgram(null);
                                        setIsBatchMaterialDropdownOpen(false);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">发送内容</label>
                                    <textarea
                                        value={batchReplyText}
                                        onChange={(e) => setBatchReplyText(e.target.value)}
                                        placeholder="请输入私聊回复内容..."
                                        className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Image Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">添加图片 (可选)</label>
                                        <div className="flex flex-wrap items-center gap-4 relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={groupReplyImageInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => setBatchReplyImage(e.target?.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <button
                                                className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setIsBatchMaterialDropdownOpen(true);
                                                    setBatchMaterialTab('图片');
                                                    setBatchMaterialQuery('');
                                                }}
                                            >
                                                <ImageIcon size={24} className="mb-1" />
                                                <span className="text-[10px]">添加图片</span>
                                            </button>

                                            {batchReplyImage && (
                                                <div className="relative w-20 h-20 group">
                                                    <img src={batchReplyImage} className="w-full h-full object-cover rounded-lg border border-slate-200" alt="Selected" />
                                                    <button
                                                        onClick={() => setBatchReplyImage(null)}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            )}

                                            {isBatchMaterialDropdownOpen && batchMaterialTab === '图片' && (
                                                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col">
                                                    <div className="p-2 border-b border-slate-100 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={batchMaterialQuery}
                                                            onChange={e => setBatchMaterialQuery(e.target.value)}
                                                            placeholder="搜索图片素材..."
                                                            className="flex-1 text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                setIsBatchMaterialDropdownOpen(false);
                                                                if (groupReplyImageInputRef.current) {
                                                                    groupReplyImageInputRef.current.value = '';
                                                                    groupReplyImageInputRef.current.click();
                                                                }
                                                            }}
                                                            className="px-2 py-1.5 text-[10px] font-medium bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-50 shrink-0 whitespace-nowrap"
                                                        >本地上传</button>
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto p-1">
                                                        {(() => {
                                                            const results = ['春季上新海报.png', '双十一大促.jpg', '产品介绍图.png'].filter(i => i.toLowerCase().includes(batchMaterialQuery.toLowerCase()));
                                                            if (results.length === 0) return <div className="py-4 text-center text-xs text-slate-400">暂无数据</div>;
                                                            return results.map(item => (
                                                                <div
                                                                    key={item}
                                                                    className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer flex items-center gap-2"
                                                                    onClick={() => {
                                                                        setBatchReplyImage('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop');
                                                                        setIsBatchMaterialDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <ImageIcon size={12} className="text-slate-400" />
                                                                    {item}
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mini Program Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">添加小程序 (可选)</label>
                                        <div className="flex flex-col gap-2 relative">
                                            <button
                                                className="w-full h-10 border border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setIsBatchMaterialDropdownOpen(true);
                                                    setBatchMaterialTab('小程序卡片');
                                                    setBatchMaterialQuery('');
                                                }}
                                            >
                                                <FileText size={16} />
                                                <span className="text-xs font-medium">选择小程序</span>
                                            </button>

                                            {batchReplyMiniProgram && (
                                                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between group">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <LinkIcon size={14} className="text-indigo-500 shrink-0" />
                                                        <span className="text-xs font-medium text-slate-700 truncate" title={batchReplyMiniProgram}>
                                                            {batchReplyMiniProgram}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => setBatchReplyMiniProgram(null)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}

                                            {isBatchMaterialDropdownOpen && batchMaterialTab === '小程序卡片' && (
                                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col">
                                                    <div className="p-2 border-b border-slate-100 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={batchMaterialQuery}
                                                            onChange={e => setBatchMaterialQuery(e.target.value)}
                                                            placeholder="搜索小程序..."
                                                            className="flex-1 text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded outline-none focus:border-indigo-400"
                                                        />
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto p-1">
                                                        {(() => {
                                                            const results = ['商品详情页', '活动主会场', '会员中心'].filter(i => i.toLowerCase().includes(batchMaterialQuery.toLowerCase()));
                                                            if (results.length === 0) return <div className="py-4 text-center text-xs text-slate-400">暂无数据</div>;
                                                            return results.map(item => (
                                                                <div
                                                                    key={item}
                                                                    className="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer flex items-center gap-2"
                                                                    onClick={() => {
                                                                        setBatchReplyMiniProgram(item);
                                                                        setIsBatchMaterialDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <FileText size={12} className="text-slate-400" />
                                                                    {item}
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setIsBatchReplyOpen(false);
                                        setBatchReplyText('');
                                        setBatchReplyImage(null);
                                        setBatchReplyMiniProgram(null);
                                        setIsBatchMaterialDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    disabled={!batchReplyText.trim()}
                                    onClick={() => {
                                        // Simulate send
                                        setIsBatchReplyOpen(false);
                                        setBatchReplyText('');
                                        setBatchReplyImage(null);
                                        setSelectedLikers([]);

                                        // Show confirm dialog
                                        if (window.confirm(`已成功给 ${selectedLikers.length} 位客户发送私聊消息！\n是否立即前往查看？`)) {
                                            // Open chat tabs for all selected users
                                            if (tabs && setTabs && setActiveTabId && setActiveModule) {
                                                let newTabs = [...tabs];
                                                let lastTabId = '';
                                                selectedLikers.forEach(userId => {
                                                    const user = sessionList.find(s => s.customer788Id === userId) || sessionList[0];
                                                    const tabId = user ? `chat-${user.customer788Id}` : `chat-${userId}`;
                                                    if (!newTabs.find(t => t.id === tabId)) {
                                                        newTabs.push({ id: tabId, title: user ? user.name : '新会话', type: 'chat' });
                                                    }
                                                    lastTabId = tabId;
                                                });
                                                setTabs(newTabs);
                                                setActiveTabId(lastTabId);
                                                setActiveModule('chat');
                                            }
                                        }
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send size={14} />
                                    确认发送
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- src/components/Workspace.tsx ---

interface WorkspaceTab {
  id: string;
  title: string;
  routeTitle?: string;
  type: 'chat' | 'feature';
}

interface ChatCustomerProfile {
  name: string;
  source: string;
  status: string;
  subtitle: string;
  phone: string;
  baseId: string;
  unionid: string;
  id788: string;
  ch: string;
  friendAddedAt?: string;
  abnormalTag: string | null;
  isBlacklisted: boolean;
  blacklistReason: string;
  receptionStatus?: string;
  hasConfirmedReception?: boolean;
}

interface PrivateFollowUpNote {
  id: string;
  operator: string;
  action: string;
  time: string;
  text: string;
}

interface DeliveryGroupOperationLog {
  id: string;
  houseCode: string;
  operator: string;
  time: string;
}

type PrivateMatchRecordLoadState = 'loading' | 'ready' | 'error';

interface PrivateMatchProperty {
  id: string;
  source: string;
  title: string;
  community: string;
  layout: string;
  area: string;
  totalPrice: string;
  unitPrice: string;
  cover: string;
  hasIntent?: boolean;
  propertyType?: string;
  ownership?: string;
  orientation?: string;
  elevator?: string;
  floor?: string;
  mortgage?: string;
}

interface PrivateMatchRecord {
  id: string;
  time: string;
  agentName: string;
  properties: PrivateMatchProperty[];
}

interface CustomGroupMember {
  customer788Id: string;
  workflow: string;
  outputs: string[];
}

interface CustomGroup {
  id: string;
  name: string;
  workflows: string[];
  outputs: string[];
  members: CustomGroupMember[];
  status: 'idle' | 'recalculating';
}

type PrivateSessionFilterField = 'customerName' | 'followupNote' | 'id788' | 'phone';
type ActiveChatFilter = 'all' | 'session_abnormal' | 'lead_all' | 'lead_abnormal' | 'community_need' | 'moments_need' | 'transfer_mining' | `custom:${string}`;
type GroupMessageSenderRole = 'customer' | 'operator' | 'broker' | 'unknown';

interface GroupUnreadSourceMessage {
  senderRole: GroupMessageSenderRole;
}

const privateSessionFilterOptions: Array<{ value: PrivateSessionFilterField; label: string; placeholder: string }> = [
  { value: 'customerName', label: '客户名称', placeholder: '搜索客户名称' },
  { value: 'followupNote', label: '跟进备注', placeholder: '搜索跟进备注' },
  { value: 'id788', label: '788ID', placeholder: '多个788ID用,分隔' },
  { value: 'phone', label: '手机号', placeholder: '搜索手机号' }
];

const abnormalUserOptions = ['长周期观望', '超低预算', '已成交', '非决策人看房'];
const pauseFollowupFilterOptions = ['无异常', '全部暂停跟进用户', ...abnormalUserOptions];

// --- pause follow-up filter helper ---
function filterSessionsByPauseTags(sessions, selectedTags) {
  if (selectedTags.length === 0) return sessions;
  if (selectedTags.includes('无异常')) {
    return sessions.filter(session => !session.abnormalTag);
  }
  if (selectedTags.includes('全部暂停跟进用户')) {
    return sessions.filter(session => Boolean(session.abnormalTag));
  }
  return sessions.filter(session => selectedTags.includes(session.abnormalTag || '无异常'));
}
// --- end pause follow-up filter helper ---

// --- session reception status helper ---
function getSessionReceptionStatus(session, profile) {
  const receptionStatus = profile?.receptionStatus || session.receptionStatus || (session.tag === 'AI' ? 'AI' : '小B');
  return receptionStatus === '线索承接' ? '小B' : receptionStatus;
}
// --- end session reception status helper ---

function getSessionReceptionBadgeClass(status) {
  return status === 'AI' ? 'border-fuchsia-300 text-fuchsia-500 bg-fuchsia-50' :
    status === '小B' ? 'border-blue-300 text-blue-500 bg-blue-50' :
    status === '运营' ? 'border-amber-300 text-amber-600 bg-amber-50' :
    status === '业务专家' ? 'border-emerald-300 text-emerald-600 bg-emerald-50' :
    'border-slate-300 text-slate-500 bg-slate-50';
}

// --- pause badge text helper ---
function getPauseFollowupBadgeText(abnormalTag) {
  return abnormalTag || '';
}
// --- end pause badge text helper ---

// --- private session ownership filter helper ---
function filterSessionsByOwnership(sessions, selectedCity, selectedCustomerService) {
  return sessions.filter(session =>
    (!selectedCity || session.city === selectedCity) &&
    (!selectedCustomerService || session.customerService === selectedCustomerService)
  );
}
// --- end private session ownership filter helper ---

// --- custom group recalculation helper ---
function recalculateExistingCustomGroupMembers(members, workflows, outputs) {
  return members.filter(member =>
    workflows.includes(member.workflow) &&
    member.outputs.some(output => outputs.includes(output))
  );
}
// --- end custom group recalculation helper ---

// --- moments like tier helper ---
function buildMomentsLikeTiers(currentLikes, recentLikeCounts, _ignoredNonCurrentLikes = [], threshold = 3) {
  const priorityLikes = [];
  const frequentLikeMap = new Map();
  currentLikes.forEach(like => {
    const recentLikeCount = recentLikeCounts[like.userId] || 0;
    if (recentLikeCount >= threshold) {
      frequentLikeMap.set(like.userId, { ...like, recentLikeCount });
    } else {
      priorityLikes.push(like);
    }
  });
  const frequentLikes = Array.from(frequentLikeMap.values())
    .sort((a, b) => (b.recentLikeCount || 0) - (a.recentLikeCount || 0));
  return { priorityLikes, frequentLikes };
}
// --- end moments like tier helper ---

// 群聊未读仅由消息角色顺序决定：C 端发言置未读，运营或经纪人回复清除未读，身份未知不改变状态。
function deriveGroupUnreadStatus(messages: GroupUnreadSourceMessage[]) {
  let unread = false;
  messages.forEach(message => {
    if (message.senderRole === 'customer') {
      unread = true;
    } else if (unread && (message.senderRole === 'operator' || message.senderRole === 'broker')) {
      unread = false;
    }
  });
  return unread;
}

const GROUP_MESSAGE_TRAILS: Record<number, GroupUnreadSourceMessage[]> = {
  1: [{ senderRole: 'customer' }, { senderRole: 'broker' }],
  2: [{ senderRole: 'customer' }],
  3: [{ senderRole: 'customer' }, { senderRole: 'broker' }],
  4: [{ senderRole: 'customer' }],
  5: [{ senderRole: 'customer' }, { senderRole: 'operator' }],
  6: [{ senderRole: 'customer' }, { senderRole: 'unknown' }],
  7: [{ senderRole: 'customer' }],
  8: [{ senderRole: 'customer' }, { senderRole: 'operator' }],
  9: [{ senderRole: 'customer' }, { senderRole: 'broker' }, { senderRole: 'customer' }],
  10: [{ senderRole: 'customer' }]
};

// --- moments date range filter helper ---
const MOMENT_DATE_FILTER_MIN = '2026-05-01';
const MOMENT_DATE_FILTER_TODAY = '2026-07-07';
const MOMENT_DATE_FILTER_DEFAULT_LABEL = '发布日期：全部';

function normalizeMomentDateKey(value) {
  if (!value) return '';
  const text = String(value).trim();
  const directMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (directMatch) return `${directMatch[1]}-${directMatch[2]}-${directMatch[3]}`;
  const date = new Date(text.replace(/-/g, '/'));
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMomentDateRangeLabel(startDate, endDate) {
  const startKey = normalizeMomentDateKey(startDate);
  const endKey = normalizeMomentDateKey(endDate);
  if (startKey && endKey) return `发布日期：${startKey} 至 ${endKey}`;
  if (startKey) return `发布日期：${startKey} 起`;
  if (endKey) return `发布日期：截至 ${endKey}`;
  return MOMENT_DATE_FILTER_DEFAULT_LABEL;
}

function filterMomentGroupsByDateRange(groups, startDate, endDate) {
  const startKey = normalizeMomentDateKey(startDate);
  const endKey = normalizeMomentDateKey(endDate);
  return groups.filter(group => {
    const dateKey = normalizeMomentDateKey(group.dateKey || group.latestTime || group.time);
    if (!dateKey) return false;
    if (startKey && dateKey < startKey) return false;
    if (endKey && dateKey > endKey) return false;
    return true;
  });
}
// --- end moments date range filter helper ---

const privateCityOptions = ['合肥', '南京'];
const privateCustomerServiceOptions = ['张三', '李四', '王五'];

const sessionList = [
  { name: '雾里看花', time: '5-06', msg: '稍等，我找了解这套房的经纪人和...', tag: '', unread: false, customer788Id: '7881301319959329', abnormalTag: null, isBlacklisted: false, tabTitle: '雾里看花', city: '合肥', customerService: '张三' },
  { name: '优庆状1347086...', time: '4-25', msg: '[群邀请消息]', tag: 'AI', unread: false, customer788Id: '7881301319959307', abnormalTag: null, isBlacklisted: false, tabTitle: '优庆状1347086...', city: '南京', customerService: '李四' },
  { name: 'A_南京miu猫猫', time: '4-17', msg: '您最近关注哪个区域板块的楼盘和...', tag: 'AI', unread: false, customer788Id: '7881301319959305', abnormalTag: null, isBlacklisted: false, tabTitle: 'A_南京miu猫猫', city: '南京', customerService: '王五' },
  { name: '二宝', time: '4-17', msg: '[群邀请消息]', tag: '', unread: false, customer788Id: '7881301319959304', abnormalTag: null, isBlacklisted: false, tabTitle: '二宝', city: '合肥', customerService: '张三' },
  { name: '施向阳 家庭指导师', time: '4-13', msg: '您最近关注哪个区域板块的楼盘和...', tag: '', unread: false, customer788Id: '7881301319959306', abnormalTag: null, isBlacklisted: false, tabTitle: '施向阳 家庭指导师', city: '合肥', customerService: '李四' },
  { name: '我已在途中', time: '4-05', msg: '看到您关注了蜀山区西七里塘、五...', tag: 'AI', unread: false, customer788Id: '7881301319959308', abnormalTag: null, isBlacklisted: false, tabTitle: '我已在途中', city: '合肥', customerService: '张三' },
  { name: '浩~心飞', time: '3-30', msg: '您现在关注哪个板块，我给您找几...', tag: '', unread: false, customer788Id: '7881301319959344', abnormalTag: null, isBlacklisted: false, tabTitle: '浩~心飞', city: '南京', customerService: '王五' },
  { name: '钟钟鸣', time: '3-29', msg: '下午好，年后南京房价有了新变化...', tag: '', unread: false, customer788Id: '7881301319959301', abnormalTag: null, isBlacklisted: false, tabTitle: '钟钟鸣', city: '南京', customerService: '张三' },
];

const DISTRIBUTION_AGENTS = [
  { id: '7881301344951251', name: '刘建', sectors: ['五星墩', '西园', '三里庵', '柏堰湖'], company: '乐屋', store: '奥林花园店' },
  { id: '7881303026971647', name: '测试数据', sectors: ['包公'], company: '测试数据', store: '测试门店' },
  { id: '7881300738940293', name: '王银龙', sectors: ['三孝口', '逍遥津', '大杨', '高新区'], company: '乐屋', store: '红星路店' },
  { id: '7881300036958169', name: '李晓晨', sectors: ['七里塘', '瑶海社区', '磨店', '柏堰湖'], company: '乐屋', store: '高速中央公园店' },
  { id: '7881302814977818', name: '王剑剑', sectors: ['七里塘', '龙岗', '大兴镇', '高新区'], company: '乐屋', store: '高速中央公园店' },
  { id: '7881303421981216', name: '刘巧巧', sectors: ['七里塘', '磨店', '站北', '柏堰湖'], company: '乐屋', store: '高速中央公园店' },
  { id: '7881299888957977', name: '钱永胜', sectors: ['海棠', '高新区'], company: '乐屋', store: '上城国际店' },
  { id: '7881300517981807', name: '朱鹏', sectors: ['森林公园', '四里河', '林店', '柏堰湖'], company: '乐屋', store: '上城国际店' },
  { id: '7881300805089774', name: '张杰', sectors: ['森林公园', '四里河', '林店', '高新区'], company: '乐屋', store: '上城国际店' },
  { id: '7881300322912364', name: '杜宗建', sectors: ['柏堰湖', '高新区'], company: '云房源', store: '云房源' },
  { id: '7881300000975661', name: '张敏', sectors: ['方庙', '胜利路', '柏堰湖'], company: '乐屋', store: '濉溪路店' },
  { id: '7881300921994582', name: '阮海洋', sectors: ['三孝口', '高新区'], company: '乐屋', store: '蒙城路店' },
  { id: '7881299711927154', name: '程明', sectors: ['店埠', '撮镇', '肥东', '龙岗', '柏堰湖'], company: '云房源', store: '云房源' },
  { id: '7881301429949948', name: '周中磊', sectors: ['包公', '常青', '大圩镇', '方兴', '高新区'], company: '云房源', store: '云房源' },
  { id: '7881302169980535', name: '李王俊', sectors: ['柏堰湖'], company: '云房源', store: '云房源' },
  { id: '7881301697916864', name: '吴存飞', sectors: ['肥东', '高新区'], company: '云房源', store: '云房源' },
  { id: '7881301878984978', name: '张磊', sectors: ['柏堰湖'], company: '云房源', store: '云房源' },
  { id: '7881300243993046', name: '赵晓贞', sectors: ['肥东', '高新区'], company: '云房源', store: '云房源' },
  { id: '7881299661064044', name: '许红军', sectors: ['肥东', '柏堰湖'], company: '云房源', store: '云房源' },
  { id: '7881301700911547', name: '蒋晓静', sectors: ['柏堰湖', '高新区'], company: '云房源', store: '云房源' },
  { id: '7881301088730912', name: '陈倩', sectors: ['高新区', '科学岛'], company: '乐屋', store: '长江西路店' },
  { id: '7881301187622380', name: '赵锐', sectors: ['柏堰湖', '蜀山产业园'], company: '乐屋', store: '长江西路店' },
  { id: '7881301267190481', name: '杨帆', sectors: ['高新区', '大蜀山'], company: '乐屋', store: '长江西路店' },
  { id: '7881301358056129', name: '孙际玉', sectors: ['柏堰湖', '科学岛'], company: '乐屋', store: '蜀山产业园店' },
  { id: '7881301489033672', name: '曹锐报', sectors: ['高新区', '柏堰湖'], company: '乐屋', store: '蜀山产业园店' },
  { id: '7881301598824106', name: '吴雨晴', sectors: ['柏堰湖', '桃花镇'], company: '乐屋', store: '蜀山产业园店' },
  { id: '7881301662358009', name: '韩潇', sectors: ['高新区', '长宁社区'], company: '乐屋', store: '创新产业园店' },
  { id: '7881301734908127', name: '郭彬', sectors: ['柏堰湖', '高新区'], company: '乐屋', store: '创新产业园店' },
  { id: '7881301845620915', name: '秦宇', sectors: ['科学岛', '柏堰湖'], company: '乐屋', store: '创新产业园店' },
  { id: '7881301967802238', name: '许航', sectors: ['高新区', '蜀西湖'], company: '云房源', store: '高新银泰店' },
  { id: '7881302034186501', name: '马晓峰', sectors: ['柏堰湖', '方兴大道'], company: '云房源', store: '高新银泰店' },
  { id: '7881302176654308', name: '陆思雨', sectors: ['高新区', '柏堰湖'], company: '云房源', store: '高新银泰店' },
  { id: '7881302287564901', name: '汤莉', sectors: ['高新区', '软件园'], company: '乐屋', store: '软件园店' },
  { id: '7881302398475012', name: '罗成', sectors: ['柏堰湖', '香樟大道'], company: '乐屋', store: '软件园店' },
  { id: '7881302499586123', name: '何敏', sectors: ['高新区', '柏堰湖'], company: '乐屋', store: '软件园店' },
  { id: '7881300914298822', name: '钱圣豪', sectors: ['包公', '常青', '淝河镇'], company: '乐屋加盟', store: '--' },
  { id: '7881301001220186', name: '高雅', sectors: ['双凤工业区', '长丰'], company: '乐屋加盟', store: '--' }
];

const shuffleBySeed = <T,>(items: T[], seed: number) => {
  const next = [...items];
  let state = seed || 1;
  for (let i = next.length - 1; i > 0; i -= 1) {
    state = (state * 9301 + 49297) % 233280;
    const j = Math.floor((state / 233280) * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const buildRecommendedDistributorGroups = (blocks: string[], seed = Date.now()) => {
  const normalizedBlocks = blocks.map(block => block.trim()).filter(Boolean);
  const matchedAgents = DISTRIBUTION_AGENTS
    .filter(agent => agent.store && agent.store !== '--')
    .filter(agent => agent.sectors.some(sector => normalizedBlocks.some(block => sector.includes(block) || block.includes(sector))))
    .slice(0, 60);
  const recommendedAgents = shuffleBySeed(matchedAgents, seed).slice(0, 30);
  const storeMap = new Map<string, typeof recommendedAgents>();
  recommendedAgents.forEach(agent => {
    if (!storeMap.has(agent.store)) {
      storeMap.set(agent.store, []);
    }
    storeMap.get(agent.store)!.push(agent);
  });
  return shuffleBySeed(Array.from(storeMap.entries()), seed + 17).map(([store, agents]) => ({
    store,
    agents: shuffleBySeed(agents, seed + store.length)
  }));
};

const contactList = [
  { name: '张伟', tag: 'A类客户', status: '跟进中', avatar: 'ZW' },
  { name: '王芳', tag: 'B类客户', status: '待跟进', avatar: 'WF' },
  { name: '李强', tag: 'A类客户', status: '已成交', avatar: 'LQ' },
  { name: '赵敏', tag: 'C类客户', status: '暂无意向', avatar: 'ZM' },
  { name: '孙丽', tag: 'B类客户', status: '跟进中', avatar: 'SL' },
];

const MOCK_ACCOUNTS: EnterpriseAccount[] = [
    {
        id: 'a1',
        name: '365选房师-淘淘',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Tao&background=0D8ABC&color=fff',
        city: '南京',
        lastMoment: { content: '🔥【河西中·精装现房】万科·星雨华府，业主急售！', type: 'text' }
    },
    {
        id: 'a2',
        name: '365选房师-宁宁',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Ning&background=10B981&color=fff',
        city: '南京',
        lastMoment: { type: 'image' }
    },
    {
        id: 'a3',
        name: '365淘房官方号',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=365&background=ff9900&color=fff',
        city: '南京',
        lastMoment: { type: 'channels' }
    },
    {
        id: 'hf1',
        name: '海房夏夏',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=夏&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf2',
        name: '海房秋秋',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=秋&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf3',
        name: '海房蕾蕾',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=蕾&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf4',
        name: '海房含含',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=含&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf5',
        name: '海房小助手',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=手&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf6',
        name: '房博士楼哥',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=哥&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf7',
        name: '房博士小安',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=安&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf8',
        name: '海房菲菲',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=菲&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf9',
        name: '海房妙妙',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=妙&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf10',
        name: '海房小赞',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=赞&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf11',
        name: 'AI找房-澄澄',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=澄&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf12',
        name: '海房苏苏',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=苏&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf13',
        name: '海房雅雅',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=雅&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf14',
        name: 'AI找房-小希',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=娅&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf15',
        name: 'AI找房-月月',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=希&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf16',
        name: '海房琪琪',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=月&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf17',
        name: '海房柴柴',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=琪&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf18',
        name: '海房可乐',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=柴&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf19',
        name: '海房冰冰',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=乐&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf20',
        name: '选房分析师霏霏',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=冰&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf21',
        name: '选房分析师家家',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=霏&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf22',
        name: 'AI找房',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=家&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf23',
        name: 'AI找房-柒柒',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=房&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf24',
        name: '海房时一',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=柒&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf25',
        name: '海房露露',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=一&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf26',
        name: '海房在在',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=露&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf27',
        name: '房博士妍姐',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=在&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf28',
        name: '选房分析师合合',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=姐&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf29',
        name: '房博士奋斗',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=合&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf30',
        name: 'AI找房-雪碧',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=斗&background=random&color=fff',
        city: '合肥'
    },
    {
        id: 'hf31',
        name: '选房分析师娅娅',
        avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=碧&background=random&color=fff',
        city: '合肥'
    },
];

const HEFEI_MOMENT_CONTENT = `🏠总价89万！瑶海保利精装四房
📅2018年交房 满五唯一税费低
🙂中间楼层不挡采光 通透边户

💰价格好谈，感兴趣私发「9」看位置~`;
const HEFEI_MOMENT_MEDIA = [
    { type: 'image', url: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80' }
];
const HEFEI_MOMENT_ACCOUNT_IDS = ['hf1', 'hf2', 'hf3', 'hf4', 'hf5', 'hf6', 'hf7', 'hf8', 'hf9', 'hf10', 'hf11', 'hf12', 'hf13', 'hf14', 'hf15', 'hf16', 'hf17', 'hf18', 'hf19', 'hf20', 'hf21', 'hf22', 'hf23', 'hf24', 'hf25', 'hf26', 'hf27', 'hf28', 'hf29', 'hf30', 'hf31'];
const HEFEI_MOMENT_LIKES: MomentLike[] = [
    { userId: 'c_hf_l1', name: '李姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l2', name: '王哥', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l3', name: '张老师', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l4', name: '陈女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l5', name: '刘先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l6', name: '周姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l7', name: '吴总', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l8', name: '徐女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l9', name: '孙先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l10', name: '朱姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l11', name: '胡哥', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l12', name: '郭老师', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l13', name: '何女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l14', name: '高先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l15', name: '林姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l16', name: '马先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l17', name: '罗女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l18', name: '梁哥', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l19', name: '郑姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l20', name: '谢先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l21', name: '宋女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l22', name: '唐哥', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { userId: 'c_hf_l23', name: '许姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
];
const HEFEI_MOMENT_COMMENTS: MomentComment[] = [
    { id: 'hf_c1', userId: 'c_hf_l2', name: '王哥', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '首付大概准备多少能上车？', time: '2026-05-06 10:11:00' },
    { id: 'hf_c2', userId: 'c_hf_l4', name: '陈女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '这个户型客厅朝南吗？', time: '2026-05-06 10:14:00' },
    { id: 'hf_c3', userId: 'c_hf_l7', name: '吴总', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '89万能做到四房，性价比挺高的', time: '2026-05-06 10:18:00' },
    { id: 'hf_c4', userId: 'c_hf_l9', name: '孙先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '离地铁口大概几分钟？', time: '2026-05-06 10:22:00' },
    { id: 'hf_c5', userId: 'c_hf_l12', name: '郭老师', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '学区和物业这边方便说下吗？', time: '2026-05-06 10:29:00' },
    { id: 'hf_c6', userId: 'c_hf_l14', name: '高先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '有这套房的实拍视频吗？', time: '2026-05-06 10:35:00' },
    { id: 'hf_c7', userId: 'c_hf_l17', name: '罗女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '这个楼层采光看着确实不错', time: '2026-05-06 10:43:00' },
    { id: 'hf_c8', userId: 'c_hf_c8', name: '叶先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '晚上方便约带看吗？', time: '2026-05-06 10:56:00' },
    { id: 'hf_c9', userId: 'c_hf_l21', name: '宋女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: '我已经私发9了，麻烦把具体位置发我', time: '2026-05-06 11:05:00' }
];
const HEFEI_MOMENT_COMMENT_GROUPS: Record<number, MomentComment[]> = {
    0: [HEFEI_MOMENT_COMMENTS[0], HEFEI_MOMENT_COMMENTS[1]],
    5: [HEFEI_MOMENT_COMMENTS[2], HEFEI_MOMENT_COMMENTS[3]],
    11: [HEFEI_MOMENT_COMMENTS[4], HEFEI_MOMENT_COMMENTS[5]],
    18: [HEFEI_MOMENT_COMMENTS[6]],
    24: [HEFEI_MOMENT_COMMENTS[7], HEFEI_MOMENT_COMMENTS[8]]
};
const SHARED_MOMENT_CONTENT = `🔥【河西中·精装现房】万科·星雨华府，业主急售！

单价仅需3.X万/平，比同户型便宜50万！
满二唯一，省税费。看房随时有钥匙！🔑

户型方正，南北通透，采光极佳。周边配套成熟，距离地铁站仅500米，双学区加持，未来升值空间大。

房东因为工作调动急需置换，价格还有很大谈的空间。近期河西中板块热度持续上升，这样高性价比的房源出来一套少一套。

🔗点链接查看详情#小程序://365淘房/kGqr6SUQCfq038c

#南京房产 #河西买房 #捡漏房源`;

const MOCK_MOMENTS: SimMoment[] = [
    ...HEFEI_MOMENT_ACCOUNT_IDS.map((accountId, index) => ({
        id: `m_hf_${index + 1}`,
        groupId: 'PYQ-20260506-HF',
        accountId,
        content: HEFEI_MOMENT_CONTENT,
        media: HEFEI_MOMENT_MEDIA,
        time: '2026-05-06 09:30:00',
        likes: index === 0 ? HEFEI_MOMENT_LIKES : [],
        comments: HEFEI_MOMENT_COMMENT_GROUPS[index] || []
    })),
    {
        id: 'm1',
        groupId: 'PYQ-NJ-20260506-001',
        accountId: 'a1',
        content: SHARED_MOMENT_CONTENT,
        media: [
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house1/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house2/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house3/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house4/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house5/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house6/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house7/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house8/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house9/800/600' }
        ],
        time: '2026-05-06 16:30:00',
        likes: [
            { userId: 'u1', name: '陈先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
            { userId: 'u2', name: '刘女士', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
        ],
        comments: [
            { id: 'c1', userId: 'u1', name: '陈先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&facepad=2&w=256&h=256&q=80', content: '这套房还在吗？', time: '2026-05-06 16:36:00' },
            { id: 'c2', userId: 'a1', name: '365选房师-淘淘', avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Tao&background=0D8ABC&color=fff', content: '还在的，陈先生，您什么时候方便看房？', time: '2026-05-06 16:39:00', replyToName: '陈先生', replyToId: 'u1' }
        ]
    },
    {
        id: 'm1-2',
        groupId: 'PYQ-NJ-20260506-001',
        accountId: 'a2',
        content: SHARED_MOMENT_CONTENT,
        media: [
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house1/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house2/800/600' }
        ],
        time: '2026-05-06 16:27:00',
        likes: [
            { userId: 'u3', name: '王总', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
        ],
        comments: [
            { id: 'c3', userId: 'u3', name: '王总', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&facepad=2&w=256&h=256&q=80', content: '周末可以安排看下吗？', time: '2026-05-06 16:34:00' }
        ]
    },
    {
        id: 'm1-3',
        groupId: 'PYQ-NJ-20260506-001',
        accountId: 'a3',
        content: SHARED_MOMENT_CONTENT,
        media: [
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house1/800/600' },
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/house2/800/600' }
        ],
        time: '2026-05-06 16:24:00',
        likes: [],
        comments: [
            { id: 'c4', userId: 'u4', name: '李阿姨', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&facepad=2&w=256&h=256&q=80', content: '这个小区环境怎么样？', time: '2026-05-06 16:31:00' },
            { id: 'c5', userId: 'a3', name: '365淘房官方号', avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=365&background=ff9900&color=fff', content: '环境非常不错，绿化率高。', time: '2026-05-06 16:33:00', replyToName: '李阿姨', replyToId: 'u4' },
            { id: 'c9', userId: 'a1', name: '365选房师-淘淘', avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Tao&background=0D8ABC&color=fff', content: '你好', time: '2026-05-06 16:41:00' },
            { id: 'c10', userId: 'a2', name: '365选房师-宁宁', avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Ning&background=10B981&color=fff', content: '你好', time: '2026-05-06 16:42:00' },
            { id: 'c11', userId: 'a3', name: '365淘房官方号', avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=365&background=ff9900&color=fff', content: '你好', time: '2026-05-06 16:43:00' }
        ]
    },
    {
        id: 'm3',
        groupId: 'PYQ-NJ-20260506-002',
        accountId: 'a1',
        content: '重磅！首付比例再降！\n\n新政出台，首套房首付低至15%，二套低至25%！\n这对刚需和改善群体都是极大利好。抓住窗口期，买房正当时！🏠\n\n有想了解具体政策的客户，欢迎私聊我！',
        media: [
            { type: 'image', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/policy1/800/600' }
        ],
        time: '2026-05-05 14:10:00',
        likes: [
            { userId: 'u1', name: '陈先生', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
            { userId: 'u5', name: '赵姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
        ],
        comments: [
            { id: 'c6', userId: 'u5', name: '赵姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&facepad=2&w=256&h=256&q=80', content: '二套房利率有降吗？', time: '2026-05-05 14:26:00' },
            { id: 'c7', userId: 'a1', name: '365选房师-淘淘', avatar: 'https://images.weserv.nl/?url=https://ui-avatars.com/api/?name=Tao&background=0D8ABC&color=fff', content: '赵姐，二套利率目前也是历史低点，具体我发您一份明细。', time: '2026-05-05 14:38:00', replyToName: '赵姐', replyToId: 'u5' },
            { id: 'c8', userId: 'u5', name: '赵姐', avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&facepad=2&w=256&h=256&q=80', content: '好的，发我微信上。', time: '2026-05-05 14:46:00', replyToName: '365选房师-淘淘', replyToId: 'a1' }
        ]
    },
    {
        id: 'm2',
        groupId: 'PYQ-NJ-20260506-003',
        accountId: 'a1',
        content: '今日带看日记：燕子矶板块热度不减！👍\n\n虽然天气转凉，但购房者的热情依然高涨。今天带客户看了燕子矶的几个热销盘，客户对区域配套和未来规划非常认可。\n\n视频号：365淘房南京',
        media: [
            { type: 'channels', url: 'https://images.weserv.nl/?url=https://picsum.photos/seed/video1/800/450', title: '燕子矶板块实探', thumbnail: 'https://images.weserv.nl/?url=https://picsum.photos/seed/video1/800/450', desc: '365淘房南京 · 视频号' }
        ],
        time: '2026-05-04 11:20:00',
        likes: [],
        comments: []
    }
];

function Workspace() {
  useAnalytics(); // 只用于记录 PV
  const [isSidebarOpen, setIsSidebarOpen] = useState(new URLSearchParams(location.search).has('reach'));
  const [sidebarWidth, setSidebarWidth] = useState(520);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const maxWidth = window.innerWidth / 2;

    const onMouseMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 300), maxWidth);
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    { id: 'feature-1', title: '[AI] 合肥100w学区房', type: 'feature' },
    { id: 'chat-7881301319959329', title: '雾里看花', type: 'chat' },
    { id: 'chat-7881301319959307', title: '优庆状1347086...', type: 'chat' },
    { id: 'chat-7881301319959305', title: 'A_南京miu猫猫', type: 'chat' },
    { id: 'chat-7881301319959304', title: '二宝', type: 'chat' },
    { id: 'feature-2', title: '每日私聊推送_学区房名单', type: 'feature' },
    { id: 'chat-7881301319959306', title: '施向阳 家庭指导师', type: 'chat' },
    { id: 'chat-7881301319959308', title: '我已在途中', type: 'chat' },
    { id: 'chat-7881301319959344', title: '浩~心飞', type: 'chat' },
    { id: 'chat-7881301319959301', title: '钟钟鸣', type: 'chat' },
  ]);
  const [activeTabId, setActiveTabId] = useState('chat-7881301319959329');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserTab, setSelectedUserTab] = useState<SelectionInfoTab>('记忆');
  const [activeRightPanelTab, setActiveRightPanelTab] = useState('客户档案');
  // V4.7：交付群右侧增加流转记录，本轮仅展示记录，不提供经纪人更换操作。
  const [activeGroupRightPanelTab, setActiveGroupRightPanelTab] = useState<'群档案' | '流转记录'>('群档案');
  const [selectedPrivateMatchProperty, setSelectedPrivateMatchProperty] = useState<PrivateMatchProperty | null>(null);
  const [isPrivateMatchImagePreviewOpen, setIsPrivateMatchImagePreviewOpen] = useState(false);
  const [privateMatchRecordLoadStateOverrides, setPrivateMatchRecordLoadStateOverrides] = useState<Record<string, PrivateMatchRecordLoadState>>({});
  const [isFriendRelationOpen, setIsFriendRelationOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<'chat' | 'groups' | 'moments'>('chat');
  const [selectedMomentId, setSelectedMomentId] = useState<string | null>(MOCK_MOMENTS[0].id);
  const [activeMomentFilter, setActiveMomentFilter] = useState<'all' | 'pending' | 'interacted' | 'replied'>('all');
  const [isCustomerMoreMenuOpen, setIsCustomerMoreMenuOpen] = useState(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [isReceptionConfirmModalOpen, setIsReceptionConfirmModalOpen] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const [isAbnormalTagDropdownOpen, setIsAbnormalTagDropdownOpen] = useState(false);
  const [pendingAbnormalTag, setPendingAbnormalTag] = useState<string | null | undefined>(undefined);
  const [activeChatFilter, setActiveChatFilter] = useState<ActiveChatFilter>('all');
  const [privateSessionFilterField, setPrivateSessionFilterField] = useState<PrivateSessionFilterField>('id788');
  const [privateSessionFilterKeyword, setPrivateSessionFilterKeyword] = useState('');
  const [isPrivateSessionFilterOpen, setIsPrivateSessionFilterOpen] = useState(false);
  const [isPauseFollowupFilterOpen, setIsPauseFollowupFilterOpen] = useState(false);
  const [selectedPauseFollowupTags, setSelectedPauseFollowupTags] = useState<string[]>([]);
  const [selectedPrivateCity, setSelectedPrivateCity] = useState('');
  const [selectedPrivateCustomerService, setSelectedPrivateCustomerService] = useState('');
  const [isPrivateCityFilterOpen, setIsPrivateCityFilterOpen] = useState(false);
  const [isPrivateCustomerServiceFilterOpen, setIsPrivateCustomerServiceFilterOpen] = useState(false);
  const [isLeadGroupExpanded, setIsLeadGroupExpanded] = useState(true);
  const [generatedLead788Ids, setGeneratedLead788Ids] = useState<string[]>([]);
  const [communityNeed788Ids, setCommunityNeed788Ids] = useState<string[]>(['7881301319959329', '7881301319959307']);
  const [momentsNeed788Ids, setMomentsNeed788Ids] = useState<string[]>(['7881301319959305', '7881301319959308']);
  const [privateFollowUpNotes, setPrivateFollowUpNotes] = useState<PrivateFollowUpNote[]>([
    {
      id: 'note-1',
      operator: '运营-艺心',
      action: '更新跟进备注',
      time: '2026-04-11 18:45:00',
      text: '已初步确认客户对120平左右三居更感兴趣，优先推荐柏堰湖周边高性价比房源。'
    },
    {
      id: 'note-2',
      operator: '运营-艺心',
      action: '更新跟进备注',
      time: '2026-04-11 18:39:20',
      text: '客户表达预算控制较强，后续沟通以总价和首付压力作为重点切入。'
    }
  ]);
  const [isDeliveryGroupModalOpen, setIsDeliveryGroupModalOpen] = useState(false);
  const [deliveryHouseCode, setDeliveryHouseCode] = useState('');
  const [deliveryHouseCodeError, setDeliveryHouseCodeError] = useState('');
  const [deliveryGroupNotice, setDeliveryGroupNotice] = useState('');
  const [deliveryGroupLogs, setDeliveryGroupLogs] = useState<DeliveryGroupOperationLog[]>([]);
  const [leadPromptModal, setLeadPromptModal] = useState<{
    open: boolean;
    type: 'abnormal' | 'blacklist';
    title: string;
    desc: string;
    tag?: string | null;
  }>({
    open: false,
    type: 'abnormal',
    title: '',
    desc: '',
    tag: null
  });

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    groupName: string | null;
  }>({ visible: false, x: 0, y: 0, groupName: null });
  const [groupUnreadOverrides, setGroupUnreadOverrides] = useState<Record<number, boolean>>({});

  const [pendingSidebarAction, setPendingSidebarAction] = useState<{ type: 'append', text: string, id: number } | null>(null);

  const groupCategories = [
    { id: 'internal', name: '内部群', count: 5 },
    { id: 'external', name: '外部群', count: 12 },
    { id: 'project', name: '项目群', count: 3 }
  ];

  const groupList = [
    { id: 1, name: '05.09再回首选房沟通群', category: 'delivery_private', city: '合肥', agent: '杨玉银', lastMsg: '杨玉银13696510313：@再回首 您...', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '私聊撮合建群' },
    { id: 2, name: '05.11 @选房沟通群', category: 'delivery_private', city: '合肥', agent: '郭华峰', lastMsg: '新房二手房学区房是月18949202320', time: '9:42', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '私聊撮合建群' },
    { id: 3, name: '04.17郭华峰选房沟通群', category: 'delivery_targeted', city: '合肥', agent: '郭华峰', lastMsg: '郭华峰：收到', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '定向房源建群' },
    { id: 4, name: '04.21Tige选房沟通群', category: 'delivery_targeted', city: '南京', agent: '汪晨', lastMsg: '淘达房产刘玉青13275865548：其...', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '定向房源建群' },
    { id: 5, name: '04.27咖啡不苦选房沟通群', category: 'delivery_private', city: '南京', agent: '孙晓', lastMsg: '孙晓：我上面给你发的有户型图', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '私聊撮合建群' },
    { id: 6, name: '05.09@往云深选房沟通群', category: 'delivery_private', city: '合肥', agent: '中皖译达', lastMsg: '中皖译达 李辉15856504943：[小程...', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '私聊撮合建群' },
    { id: 7, name: '05.09随风所动选房沟通群', category: 'delivery_targeted', city: '合肥', agent: '中皖译达', lastMsg: '中皖译达 李辉15856504943：[小程...', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '定向房源建群' },
    { id: 8, name: '03.24红运如意选房沟通群', category: 'delivery_private', city: '合肥', agent: '天道酬勤', lastMsg: '天道酬勤：[运营消息]', time: '5-10', unread: 1, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '私聊撮合建群' },
    { id: 9, name: '05.09万事如意选房沟通群', category: 'delivery_private', city: '南京', agent: '翟姐', lastMsg: '翟姐：好的前面给您分享的就是二环...', time: '5-10', unread: 0, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=96&h=96&q=80', service: '交付群', source: '私聊撮合建群' },
    { id: 10, name: '365南京二手房线索运营群', category: 'operation', city: '南京', agent: '运营', lastMsg: '运营消息：今日重点跟进高意向客户', time: '5-09', unread: 0, avatar: 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=96&h=96&q=80', service: '运营群', source: '运营群' },
  ];

  const [customGroups, setCustomGroups] = useState<CustomGroup[]>([
    {
      id: 'cg-1',
      name: '高潜客户',
      workflows: ['【勿选】微客3.0'],
      outputs: ['用户需要资料', '咨询学区政策，需要人工介入'],
      members: [
        { customer788Id: '7881301319959329', workflow: '【勿选】微客3.0', outputs: ['用户需要资料'] },
        { customer788Id: '7881301319959307', workflow: '【勿选】微客3.0', outputs: ['咨询学区政策，需要人工介入'] },
        { customer788Id: '7881301319959305', workflow: '【勿选】微客3.0', outputs: ['用户需要资料', '咨询学区政策，需要人工介入'] }
      ],
      status: 'idle'
    }
  ]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isOutputDropdownOpen, setIsOutputDropdownOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', workflows: [] as string[], outputs: [] as string[] });
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [customGroupNotice, setCustomGroupNotice] = useState('');
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [viewingLogicGroupId, setViewingLogicGroupId] = useState<string | null>(null);
  const [isGroupPanelOpen, setIsGroupPanelOpen] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [miniProgramContextMenu, setMiniProgramContextMenu] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const [isMatchGroupModalOpen, setIsMatchGroupModalOpen] = useState(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState<string | null>(null);
  const [matchDistributorGroups, setMatchDistributorGroups] = useState(() => buildRecommendedDistributorGroups(['柏堰湖', '高新区']));
  const [groupSearchKeyword, setGroupSearchKeyword] = useState('');
  const [selectedGroupCity, setSelectedGroupCity] = useState('合肥');
  const [groupListMode, setGroupListMode] = useState<'unread' | 'latest'>('unread');
  const [activeGroupCategory, setActiveGroupCategory] = useState<'all' | 'delivery' | 'delivery_private' | 'delivery_targeted' | 'operation'>('delivery');
  const [chatCustomerProfiles, setChatCustomerProfiles] = useState<Record<string, ChatCustomerProfile>>({
    '杜小明精品大平层17...': {
      name: '杜小明精品大平层17...',
      source: '微信',
      status: '已跟进',
      subtitle: '正常用户',
      phone: '137****2601',
      baseId: '576506933939630401',
      unionid: 'obS_rtQh4CcTdM8QJi1...',
      id788: '7881301319959301',
      ch: 'ch**01',
      abnormalTag: null,
      isBlacklisted: false,
      blacklistReason: ''
    },
    '磐云石业': {
      name: '磐云石业',
      source: '微信',
      status: '已跟进',
      subtitle: '正常用户',
      phone: '138****5520',
      baseId: '576506933939630405',
      unionid: 'obS_rtQh4CcTdM8QJi5...',
      id788: '7881301319959305',
      ch: 'ch**05',
      abnormalTag: null,
      isBlacklisted: false,
      blacklistReason: ''
    },
    '灰太狼': {
      name: '灰太狼',
      source: '微信',
      status: '已跟进',
      subtitle: '异常用户',
      phone: '136****4412',
      baseId: '576506933939630404',
      unionid: 'obS_rtQh4CcTdM8QJi4...',
      id788: '7881301319959304',
      ch: 'ch**04',
      abnormalTag: '超低预算',
      isBlacklisted: false,
      blacklistReason: ''
    },
    '升学规划王老师189...': {
      name: '升学规划王老师189...',
      source: '微信',
      status: '已跟进',
      subtitle: '正常用户',
      phone: '189****2257',
      baseId: '576506933939630407',
      unionid: 'obS_rtQh4CcTdM8QJi7...',
      id788: '7881301319959307',
      ch: 'ch**07',
      abnormalTag: null,
      isBlacklisted: false,
      blacklistReason: ''
    },
    '圈子不同别硬入': {
      name: '圈子不同别硬入',
      source: '微信',
      status: '已跟进',
      subtitle: '正常用户',
      phone: '130****4408',
      baseId: '576506933939630408',
      unionid: 'obS_rtQh4CcTdM8QJi8...',
      id788: '7881301319959308',
      ch: 'ch**08',
      abnormalTag: null,
      isBlacklisted: false,
      blacklistReason: ''
    },
    '10-16佰': {
      name: '10-16佰',
      source: '微信',
      status: '已跟进',
      subtitle: '异常用户',
      phone: '135****7619',
      baseId: '576506933939630406',
      unionid: 'obS_rtQh4CcTdM8QJi6...',
      id788: '7881301319959306',
      ch: 'ch**06',
      abnormalTag: '非决策人看房',
      isBlacklisted: false,
      blacklistReason: ''
    },
    '春天': {
      name: '春天',
      source: '微信',
      status: '黑名单',
      subtitle: '黑名单用户',
      phone: '139****8421',
      baseId: '576506933939630444',
      unionid: 'obS_rtQh4CcTdM8QJi9...',
      id788: '7881301319959344',
      ch: 'ch**44',
      abnormalTag: null,
      isBlacklisted: true,
      blacklistReason: '无购房需求'
    },
    '雾里看花': {
      name: '雾里看花',
      source: '微信',
      status: '已跟进',
      subtitle: '异常用户',
      phone: '135****0581',
      baseId: '576506933939630438',
      unionid: 'obS_rtQh4CcTdM8QJi5...',
      id788: '7881301319959329',
      ch: 'ch**v8',
      abnormalTag: '长周期观望',
      isBlacklisted: false,
      blacklistReason: '',
      receptionStatus: '线索承接'
    }
  });

  // V4.6：由权限服务返回。当前原型模拟当前员工已获配房记录菜单权限。
  const canViewPrivateMatchRecords = true;
  // 运营调研后的固定顺序：两行四列；快捷话术只保留在输入框旁，不再占用右侧栏入口。
  const privateRightPanelTabs = [
    { id: '客户档案', label: '档案', title: '客户档案' },
    { id: '用户记忆', label: '记忆', title: '用户记忆' },
    { id: '客户画像', label: '画像', title: '客户画像' },
    { id: '客户行为', label: '行为', title: '客户行为' },
    { id: '追问任务', label: '追问', title: '追问任务', hasNotice: true },
    { id: '流转记录', label: '流转', title: '流转记录' },
    ...(canViewPrivateMatchRecords ? [{ id: '配房记录', label: '配房', title: '配房记录' }] : []),
    { id: '聊天记录', label: '会话', title: '聊天记录' }
  ];

  const privateArchiveFields = [
    { label: '意向价格', value: '200万以内', tag: '固定', time: '2026-03-04 10:18:35' },
    { label: '意向购房面积/户型', value: '120平左右 / 三居', tag: '固定', time: '2026-03-04 10:18:35' },
    { label: '首付预算', value: '60万左右', tag: '固定', time: '2026-03-04 10:18:35' },
    { label: '购房目的', value: '学区房', tag: '固定', time: '2026-03-04 10:18:35' },
    { label: '关注区域', value: '柏堰湖、高新区', tag: '固定', time: '2026-03-04 10:18:35' },
    { label: '决策周期', value: '3个月内', tag: '预测', time: '2026-03-04 10:18:35' },
    { label: '购房阶段', value: '对比筛选中', tag: '预测', time: '2026-03-04 10:18:35' },
    { label: '学区需求', value: '已明确提出', tag: '固定', time: '2026-03-04 10:18:35' }
  ];

  const privatePortraitSummary = {
    name: '九九九五',
    source: '微信',
    status: '已跟进',
    subtitle: '活跃客户'
  };

  const privatePortraitBasicInfo = [
    { label: '手机号', value: '135****0581' },
    { label: 'base_id', value: '576506933939630438' },
    { label: 'unionid', value: 'obS_rtQh4CcTdM8QJi5...' },
    { label: '788ID', value: '7881301319959329' },
    { label: 'ch', value: 'ch**v8' }
  ];

  const privateFriendRelationRecords = [
    { type: 'add', title: '添加好友', time: '2026-05-06 10:42:07' },
    { type: 'delete', title: '删除好友', time: '2026-04-20 09:11:32' },
    { type: 'add', title: '添加好友', time: '2026-04-16 13:48:05' }
  ];

  const privatePortraitMaterialTags = [
    { text: '100万-150万', tone: 'blue' },
    { text: '男女不限-新房意向', tone: 'indigo' },
    { text: '天鹅湖', tone: 'purple' },
    { text: '滨湖新区', tone: 'purple' },
    { text: '100-120m²', tone: 'amber' },
    { text: '120-140m²', tone: 'amber' },
    { text: '三房', tone: 'rose' },
    { text: '新房', tone: 'emerald' }
  ];

  const privatePortraitCdpTags = [
    { text: '新房_总价偏好_300-350万元', tone: 'cyan' },
    { text: '新房_户型面积_90-99㎡', tone: 'cyan' },
    { text: '新房_业务偏好_新房', tone: 'cyan' }
  ];

  const getDefaultChatCustomerProfile = (name = '客户'): ChatCustomerProfile => ({
    name,
    source: '微信',
    status: '已跟进',
    subtitle: '正常用户',
    phone: '135****0000',
    baseId: '576506933939630400',
    unionid: 'obS_rtQh4CcTdM8QJi0...',
    id788: '7881301319959300',
    ch: 'ch**00',
    friendAddedAt: '2026-05-06 10:42:07',
    abnormalTag: null,
    isBlacklisted: false,
    blacklistReason: '',
    receptionStatus: 'AI'
  });

  const privateBehaviorItems = [
    { title: '回复预算信息', time: '2026-03-04 10:05:28', desc: '客户明确表示总价控制在200万以内。' },
    { title: '补充面积诉求', time: '2026-03-04 10:07:54', desc: '客户补充120平左右，并强调重点关注柏堰湖区域。' },
    { title: '进入人工跟进', time: '2026-03-04 10:06:22', desc: '由运营接手继续沟通，适合发送对比房源。' }
  ];

  const privateUserMemory = {
    stage: '观望期',
    longTermItems: [
      { label: '配套倾斜需求', value: '不要地下室' },
      { label: '小区排除', value: '金科东方水榭、阳光城市花园C区' },
      { label: '楼层要求', value: '一楼带院子' }
    ],
    candidateItems: [
      { label: '房产需求', value: '买房' },
      { label: '物业类型', value: '住宅' },
      { label: '外部环境需求', value: '带院子' },
      { label: '楼层要求', value: '1层' }
    ]
  };

  const privateFollowUpTasks = [
    { title: '人工介入前二次确认', time: '待处理 · 2026-07-24 10:30', text: '确认本次推荐房源是否继续发送；不合适可取消后手动回复。' }
  ];

  const privateCommunicationRecords = [
    { role: 'AI找房', time: '2026-03-04 09:56:46', text: '已完成首次问候并建立选房顾问身份。' },
    { role: '客户', time: '2026-03-04 10:05:28', text: '回复预算要求：200万以内。' },
    { role: '运营-查妍碧', time: '2026-03-04 10:06:22', text: '已转人工接手，准备发送精准筛选结果。' }
  ];

  const privateFlowRecords = [
    { time: '2026-07-21 15:05:25', receiver: '-', operator: '系统', reason: '24小时没有用户新消息' },
    { time: '2026-07-20 15:05:06', receiver: '夏艺心', operator: '夏艺心', reason: '运营主动发消息' },
    { time: '2026-04-29 16:47:36', receiver: '-', operator: '系统', reason: '24小时没有用户新消息' },
    { time: '2026-04-28 16:47:20', receiver: '夏艺心', operator: '夏艺心', reason: '运营主动发消息' },
    { time: '2026-02-27 10:22:09', receiver: '-', operator: '系统', reason: '未绑定业务板块智能体' }
  ];

  // V4.6 mock：仅模拟房源组装完成并确认发送给用户后沉淀的独立记录，不从会话消息解析生成。
  const privateMatchRecordsBySession: Record<string, PrivateMatchRecord[]> = {
    'chat-7881301319959329': [
      {
        id: 'match-202607231020',
        time: '2026-07-23 10:20:18',
        agentName: '365Claw 智能配房',
        properties: [
          {
            id: 'house-365-10086',
            source: '365淘房',
            title: '政务区地铁口三房，南北通透采光好',
            community: '琥珀御熙府',
            layout: '3室2厅1卫',
            area: '119.12㎡',
            totalPrice: '198万',
            unitPrice: '16622元/㎡',
            cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=720&q=80',
            // 线索 Agent 在用户回复后异步回写“有意向”判断；标记后保持不变。
            hasIntent: true,
            propertyType: '住宅',
            ownership: '商品房',
            orientation: '南北',
            elevator: '有电梯（两梯四户）',
            floor: '中楼层（共26层）',
            mortgage: '无抵押'
          },
          {
            id: 'house-qiaofang-26831',
            source: '巧房',
            title: '天鹅湖旁改善三居，近学校和地铁',
            community: '天鹅湖畔',
            layout: '3室2厅2卫',
            area: '126㎡',
            totalPrice: '215万',
            unitPrice: '17063元/㎡',
            cover: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=720&q=80',
            propertyType: '住宅',
            ownership: '商品房',
            orientation: '南',
            elevator: '有电梯',
            floor: '高楼层（共18层）'
          }
        ]
      },
      {
        id: 'match-202607211545',
        time: '2026-07-21 15:45:36',
        agentName: '365Claw 智能配房',
        properties: [
          {
            id: 'house-lewu-87006',
            source: '乐屋',
            title: '柏堰湖低密三居，带双阳台',
            community: '保利西山林语',
            layout: '3室2厅2卫',
            area: '120㎡',
            totalPrice: '205万',
            unitPrice: '17083元/㎡',
            cover: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=720&q=80',
            propertyType: '住宅',
            ownership: '商品房',
            orientation: '南北',
            elevator: '有电梯',
            floor: '低楼层（共11层）',
            mortgage: '有抵押'
          }
        ]
      }
    ]
  };

  const availableWorkflows = [
    '测试勿用-ai自主追问', '【勿选】微客3.0', '(仅合肥)【新推送】沉...',
    '小B智能体(周报)', '上线-走心文案', '测试数据光年',
    '测试数据', '合肥用-沉默测试3', '测试2-朋友圈引流', '测试1-沉默用户开口3'
  ];

  const availableOutputs = [
    '新房未找到匹配房源', '二手房未找到匹配房源', '用户在朋友圈有需要',
    '未找到行情，需要人工介入', '房产知识输出不符合当前政策，需要人工介入',
    '咨询学区政策，需要人工介入', '房东卖房', '租房', '用户需要资料'
  ];

  const closeCustomGroupForm = () => {
    setIsCreateGroupModalOpen(false);
    setIsOutputDropdownOpen(false);
    setEditingGroupId(null);
    setGroupForm({ name: '', workflows: [], outputs: [] });
  };

  const openCreateCustomGroup = () => {
    setEditingGroupId(null);
    setGroupForm({ name: '', workflows: [], outputs: [] });
    setIsOutputDropdownOpen(false);
    setIsCreateGroupModalOpen(true);
  };

  const openEditCustomGroup = (group: CustomGroup) => {
    if (group.status === 'recalculating') return;
    setEditingGroupId(group.id);
    setGroupForm({ name: group.name, workflows: [...group.workflows], outputs: [...group.outputs] });
    setIsOutputDropdownOpen(false);
    setIsCreateGroupModalOpen(true);
  };

  const handleSubmitCustomGroup = () => {
    const name = groupForm.name.trim();
    if (name && groupForm.workflows.length > 0 && groupForm.outputs.length > 0) {
      if (!/^[\u4e00-\u9fa5]{1,6}$/.test(name)) {
        alert('分组名称必须是1-6个汉字');
        return;
      }
      if (customGroups.some(group => group.name === name && group.id !== editingGroupId)) {
        alert('分组名称不能重复');
        return;
      }

      if (!editingGroupId) {
        setCustomGroups([...customGroups, {
          id: `cg-${Date.now()}`,
          name,
          workflows: [...groupForm.workflows],
          outputs: [...groupForm.outputs],
          members: [],
          status: 'idle'
        }]);
        closeCustomGroupForm();
        return;
      }

      const previousGroup = customGroups.find(group => group.id === editingGroupId);
      if (!previousGroup) return;

      const nextRules = {
        name,
        workflows: [...groupForm.workflows],
        outputs: [...groupForm.outputs]
      };
      setCustomGroups(current => current.map(group => group.id === editingGroupId
        ? { ...group, ...nextRules, status: 'recalculating' }
        : group
      ));
      setActiveChatFilter(`custom:${editingGroupId}`);
      setCustomGroupNotice('编辑已保存，正在重新计算当前分组内的会话…');
      closeCustomGroupForm();

      window.setTimeout(() => {
        try {
          const recalculatedMembers = recalculateExistingCustomGroupMembers(
            previousGroup.members,
            nextRules.workflows,
            nextRules.outputs
          );
          const removedCount = previousGroup.members.length - recalculatedMembers.length;
          setCustomGroups(current => current.map(group => group.id === previousGroup.id
            ? { ...group, members: recalculatedMembers, status: 'idle' }
            : group
          ));
          setCustomGroupNotice(`重新计算完成：保留 ${recalculatedMembers.length} 个会话，移出 ${removedCount} 个会话`);
        } catch (error) {
          setCustomGroups(current => current.map(group => group.id === previousGroup.id ? previousGroup : group));
          setCustomGroupNotice('重新计算失败，已回滚本次编辑，请重试');
        }
      }, 1200);
    } else {
      alert('请填写完整信息');
    }
  };

  const handleDeleteCustomGroup = (id: string) => {
    setCustomGroups(customGroups.filter(g => g.id !== id));
    if (activeChatFilter === `custom:${id}`) {
      setActiveChatFilter('all');
    }
    setDeletingGroupId(null);
  };

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const isAutomationPage=(activeTab.routeTitle||activeTab.title)==='[自动化任务]';
  const activeChatProfile = activeTab.type === 'chat'
    ? (chatCustomerProfiles[activeTab.title] || getDefaultChatCustomerProfile(activeTab.title))
    : null;
  const activePrivateMatchRecords = [...(privateMatchRecordsBySession[activeTab.id] || [])]
    .sort((a, b) => b.time.localeCompare(a.time));
  const activePrivateMatchProperties = activePrivateMatchRecords.flatMap(record => record.properties);
  const selectedPrivateMatchPropertyIndex = selectedPrivateMatchProperty
    ? activePrivateMatchProperties.findIndex(property => property.id === selectedPrivateMatchProperty.id)
    : -1;
  const hasPreviousPrivateMatchProperty = selectedPrivateMatchPropertyIndex > 0;
  const hasNextPrivateMatchProperty = selectedPrivateMatchPropertyIndex >= 0 && selectedPrivateMatchPropertyIndex < activePrivateMatchProperties.length - 1;
  const defaultPrivateMatchRecordState: PrivateMatchRecordLoadState = activeTab.id === 'chat-7881301319959306' ? 'error' : 'ready';
  const activePrivateMatchRecordState = privateMatchRecordLoadStateOverrides[activeTab.id] || defaultPrivateMatchRecordState;
  const formatPrivateMatchValue = (value?: string) => value || '—';

  const refreshPrivateMatchRecords = () => {
    setPrivateMatchRecordLoadStateOverrides(prev => ({ ...prev, [activeTab.id]: 'loading' }));
    window.setTimeout(() => {
      setPrivateMatchRecordLoadStateOverrides(prev => ({ ...prev, [activeTab.id]: 'ready' }));
    }, 550);
  };

  const sessionUsers = sessionList.map(session => {
    const profile = chatCustomerProfiles[session.tabTitle] || Object.values(chatCustomerProfiles).find(item => item.id788 === session.customer788Id) || null;
    return {
      ...session,
      customer788Id: session.customer788Id,
      abnormalTag: profile?.abnormalTag ?? session.abnormalTag,
      isBlacklisted: profile?.isBlacklisted ?? session.isBlacklisted,
      blacklistReason: profile?.blacklistReason || '',
      receptionStatus: getSessionReceptionStatus(session, profile),
      phone: profile?.phone || '',
      followupNoteText: privateFollowUpNotes.map(note => note.text).join(' '),
      profileName: session.name
    };
  });

  const uniqueBy788Id = <T extends { customer788Id: string }>(list: T[]) => {
    const record = new Map<string, T>();
    list.forEach(item => {
      if (!record.has(item.customer788Id)) {
        record.set(item.customer788Id, item);
      }
    });
    return Array.from(record.values());
  };

  const leadUsers = uniqueBy788Id(sessionUsers.filter(item => generatedLead788Ids.includes(item.customer788Id)));
  const communityNeedUsers = uniqueBy788Id(sessionUsers.filter(item => communityNeed788Ids.includes(item.customer788Id)));
  const momentsNeedUsers = uniqueBy788Id(sessionUsers.filter(item => momentsNeed788Ids.includes(item.customer788Id)));
  const transferMiningUsers = uniqueBy788Id(sessionUsers.filter(item => item.tag === 'AI' || item.msg.includes('关注')));
  const activeCustomGroupId = activeChatFilter.startsWith('custom:') ? activeChatFilter.slice('custom:'.length) : null;
  const activeCustomGroup = activeCustomGroupId ? customGroups.find(group => group.id === activeCustomGroupId) || null : null;
  const activeCustomGroupMemberIds = new Set(activeCustomGroup?.members.map(member => member.customer788Id) || []);
  const activeCustomGroupUsers = activeCustomGroup
    ? sessionUsers.filter(item => activeCustomGroupMemberIds.has(item.customer788Id))
    : [];
  const privateSessionFilterOption = privateSessionFilterOptions.find(option => option.value === privateSessionFilterField) || privateSessionFilterOptions[0];
  const privateSessionDisplayValues = Array.from(new Set(privateSessionFilterKeyword
    .split(/[,\n]+/)
    .map(term => term.trim())
    .filter(Boolean)));
  const privateSessionSearchValues = privateSessionDisplayValues.map(term => term.toLowerCase());
  const baseVisibleSessionList =
    activeCustomGroup ? activeCustomGroupUsers :
    activeChatFilter === 'lead_all' ? leadUsers :
    activeChatFilter === 'community_need' ? communityNeedUsers :
    activeChatFilter === 'moments_need' ? momentsNeedUsers :
    activeChatFilter === 'transfer_mining' ? transferMiningUsers :
    sessionUsers;
  const ownershipFilteredSessionList = filterSessionsByOwnership(
    baseVisibleSessionList,
    selectedPrivateCity,
    selectedPrivateCustomerService
  );
  const pauseFilteredSessionList = activeChatFilter === 'all'
    ? filterSessionsByPauseTags(ownershipFilteredSessionList, selectedPauseFollowupTags)
    : ownershipFilteredSessionList;
  const visibleSessionList = privateSessionSearchValues.length === 0
    ? pauseFilteredSessionList
    : pauseFilteredSessionList.filter(session => {
      const fieldValue =
        privateSessionFilterField === 'id788' ? session.customer788Id :
        privateSessionFilterField === 'phone' ? session.phone :
        privateSessionFilterField === 'followupNote' ? session.followupNoteText :
        `${session.name} ${session.msg}`;
      const normalizedFieldValue = fieldValue.toLowerCase();
      return privateSessionSearchValues.some(value => normalizedFieldValue.includes(value));
    });
  const pauseFollowupFilterLabel =
    selectedPauseFollowupTags.length === 0 ? '暂停跟进用户' :
    selectedPauseFollowupTags.includes('全部暂停跟进用户') ? '全部暂停跟进用户' :
    selectedPauseFollowupTags.length === 1 ? selectedPauseFollowupTags[0] :
    `已选${selectedPauseFollowupTags.length}项`;
  const sessionPanelTitle =
    activeCustomGroup ? activeCustomGroup.name :
    activeChatFilter === 'lead_all' ? '线索管理' :
    activeChatFilter === 'community_need' ? '社群需求' :
    activeChatFilter === 'moments_need' ? '朋友圈需求' :
    activeChatFilter === 'transfer_mining' ? '转派后挖掘' :
    '全部会话';
  const groupAgentOptions = Array.from(new Set(groupList.filter(group => group.category !== 'operation').map(group => group.agent)));
  const isGroupUnread = (group: typeof groupList[number]) =>
    Object.prototype.hasOwnProperty.call(groupUnreadOverrides, group.id)
      ? groupUnreadOverrides[group.id]
      : deriveGroupUnreadStatus(GROUP_MESSAGE_TRAILS[group.id] || []);
  const setGroupUnreadManually = (groupId: number, unread: boolean) => {
    setGroupUnreadOverrides(previous => ({ ...previous, [groupId]: unread }));
  };
  const contextMenuGroup = contextMenu.groupName ? groupList.find(group => group.name === contextMenu.groupName) : undefined;
  const visibleGroupList = groupList.filter(group => {
    const matchesCategory =
      activeGroupCategory === 'all' ||
      (activeGroupCategory === 'delivery' && group.category.startsWith('delivery')) ||
      group.category === activeGroupCategory;
    const matchesCity = selectedGroupCity === '全国' || group.city === selectedGroupCity;
    const matchesAgent = !selectedAgent || group.agent === selectedAgent;
    const matchesKeyword = !groupSearchKeyword.trim() || group.name.includes(groupSearchKeyword.trim()) || group.lastMsg.includes(groupSearchKeyword.trim());
    const matchesMode = groupListMode === 'latest' || isGroupUnread(group);
    return matchesCategory && matchesCity && matchesAgent && matchesKeyword && matchesMode;
  });

  const updateActiveChatProfile = (updates: Partial<ChatCustomerProfile>) => {
    if (activeTab.type !== 'chat') return;
    const currentProfile = chatCustomerProfiles[activeTab.title] || getDefaultChatCustomerProfile(activeTab.title);
    setChatCustomerProfiles(prev => ({
      ...prev,
      [activeTab.title]: {
        ...currentProfile,
        ...updates
      }
    }));
  };

  const handleValidLeadClick = () => {
    if (activeTab.type !== 'chat' || !activeChatProfile) return;
    if (activeChatProfile.isBlacklisted) {
      setLeadPromptModal({
        open: true,
        type: 'blacklist',
        title: '无法生成线索',
        desc: '该用户属于黑名单用户，无法成线索',
        tag: null
      });
      return;
    }
    if (activeChatProfile.abnormalTag) {
      setLeadPromptModal({
        open: true,
        type: 'abnormal',
        title: '异常用户提醒',
        desc: '该用户属于异常标记用户，是否生成线索',
        tag: activeChatProfile.abnormalTag
      });
      return;
    }
    setGeneratedLead788Ids(prev => prev.includes(activeChatProfile.id788) ? prev : [...prev, activeChatProfile.id788]);
    setActiveChatFilter('lead_all');
  };

  const handlePrivateSessionFilterFieldChange = (field: PrivateSessionFilterField) => {
    setPrivateSessionFilterField(field);
    setPrivateSessionFilterKeyword('');
    setIsPrivateSessionFilterOpen(false);
  };

  const removePrivateSessionSearchValue = (targetIndex: number) => {
    setPrivateSessionFilterKeyword(privateSessionDisplayValues.filter((_, index) => index !== targetIndex).join(','));
  };

  const togglePauseFollowupTag = (tag: string) => {
    setSelectedPauseFollowupTags(current => {
      if (tag === '无异常' || tag === '全部暂停跟进用户') {
        return current.includes(tag) ? [] : [tag];
      }
      const withoutSummary = current.filter(item => item !== '无异常' && item !== '全部暂停跟进用户');
      return withoutSummary.includes(tag)
        ? withoutSummary.filter(item => item !== tag)
        : [...withoutSummary, tag];
    });
  };

  const openDeliveryGroupModal = () => {
    setDeliveryHouseCode('');
    setDeliveryHouseCodeError('');
    setIsDeliveryGroupModalOpen(true);
  };

  const closeDeliveryGroupModal = () => {
    setIsDeliveryGroupModalOpen(false);
    setDeliveryHouseCode('');
    setDeliveryHouseCodeError('');
  };

  const submitDeliveryGroup = () => {
    const code = deliveryHouseCode.trim();
    if (!code) {
      setDeliveryHouseCodeError('请输入房源编号');
      return;
    }
    if (!/^\d+$/.test(code)) {
      setDeliveryHouseCodeError('房源编号仅支持纯数字');
      return;
    }
    setDeliveryGroupLogs(prev => [
      {
        id: `delivery-${Date.now()}`,
        houseCode: code,
        operator: '运营-艺心',
        time: '2026-05-06 10:42:07'
      },
      ...prev
    ]);
    setDeliveryGroupNotice('已通知【“新版-合肥朋友圈建群”工作流】');
    closeDeliveryGroupModal();
    window.setTimeout(() => setDeliveryGroupNotice(''), 3000);
  };

  const renderTagChipClass = (tone: string) => (
    tone === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
    tone === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30' :
    tone === 'purple' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30' :
    tone === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' :
    tone === 'rose' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30' :
    tone === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' :
    'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-900/30'
  );

  const confirmAbnormalTagChange = () => {
    if (pendingAbnormalTag === undefined) return;
    updateActiveChatProfile({
      abnormalTag: pendingAbnormalTag,
      subtitle: pendingAbnormalTag ? '异常用户' : '正常用户'
    });
    setPendingAbnormalTag(undefined);
  };

  useEffect(() => {
    if (activeTab.type === 'chat' && !privateRightPanelTabs.some(tab => tab.id === activeRightPanelTab)) {
      setActiveRightPanelTab('客户档案');
    }
  }, [activeTab.type, activeRightPanelTab]);

  useEffect(() => {
    setPendingAbnormalTag(undefined);
    setIsAbnormalTagDropdownOpen(false);
  }, [activeTabId]);

  const handleContextMenu = (e: React.MouseEvent, groupName: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      groupName
    });
  };

  const handleMiniProgramContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMiniProgramContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const openMatchGroupModal = () => {
    const nextGroups = buildRecommendedDistributorGroups(['柏堰湖', '高新区']);
    setMatchDistributorGroups(nextGroups);
    setSelectedDistributorId(null);
    setIsMatchGroupModalOpen(true);
    setMiniProgramContextMenu(prev => ({ ...prev, visible: false }));
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
    setMiniProgramContextMenu(prev => ({ ...prev, visible: false }));
  };

  const openTab = (title: string, displayTitle?: string) => {
    title=canonicalAudienceRoute(title);
    const nextTitle = displayTitle || (title.startsWith('[小B任务]') ? reachState.tasks.find(t=>t.id===title.replace('[小B任务]',''))?.name : /^\[(?:人群包|小B人群)\]/.test(title) ? (reachState.audiences.find(a=>a.id===title.replace(/^\[(?:人群包|小B人群)\]/,''))?.name||initialAudienceResources.find(a=>a.id===title.replace(/^\[(?:人群包|小B人群)\]/,''))?.name) : '') || title;
    const existingTab = tabs.find(t => canonicalAudienceRoute(t.routeTitle || t.title) === title);
    if (existingTab) {
      if (existingTab.title !== nextTitle) {
        setTabs(prev => prev.map(tab => tab.id === existingTab.id ? { ...tab, title: nextTitle, routeTitle: title } : tab));
      }
      setActiveTabId(existingTab.id);
    } else {
      const newTab: WorkspaceTab = {
        id: `feature-${Date.now()}`,
        title: nextTitle,
        routeTitle: title,
        type: 'feature'
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  const renameOpenedTab = (title: string, displayTitle: string) => {
    setTabs(prev => prev.map(tab => canonicalAudienceRoute(tab.routeTitle || tab.title) === canonicalAudienceRoute(title) ? { ...tab, title: displayTitle, routeTitle: canonicalAudienceRoute(title) } : tab));
  };

  const renderContent = () => {
    const featureRouteTitle = activeTab.routeTitle || activeTab.title;
    if(featureRouteTitle==='[自动化任务]') return <AutomationWorkspace/>;
    if(featureRouteTitle.startsWith('[小B任务]')) return <ReachTaskDetail key={featureRouteTitle} taskId={featureRouteTitle.replace('[小B任务]','')}/>;
    if(featureRouteTitle.startsWith('[人群包]')||featureRouteTitle.startsWith('[小B人群]')) return <AudiencePackageDetail key={featureRouteTitle} audienceId={featureRouteTitle.replace(/^\[(?:人群包|小B人群)\]/,'')} displayName={activeTab.title}/>;
    if(featureRouteTitle.startsWith('[主动激活任务]')) return <ActivationTaskDetail key={featureRouteTitle} taskId={featureRouteTitle.replace('[主动激活任务]','')}/>;

    if (activeTab.type === 'chat') {
      const chatDisplayName = activeChatProfile?.name || activeTab.title;
      return (
        <div className="flex h-full w-full">
           {/* Chat Area */}
           <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950">
             {/* Chat Header */}
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg">{chatDisplayName}</span>
                <span className="text-emerald-500 text-xs bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">微信</span>
                <span className="text-xs text-zinc-500 ml-2">合肥 | AI找房</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <button onClick={openDeliveryGroupModal} className="px-3 py-1.5 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    创建交付群
                  </button>
                  <button onClick={handleValidLeadClick} className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    有效会话线索
                  </button>
                  <button className="px-3 py-1.5 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    切换AI
                  </button>
                </div>
                {deliveryGroupNotice && (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {deliveryGroupNotice}
                  </div>
                )}
                {activeChatProfile?.receptionStatus && (
                  <div className="text-[10px] text-orange-500">
                    当前接待: {activeChatProfile.receptionStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 bg-zinc-50/30 dark:bg-zinc-900/10">
              <div className="text-center text-xs text-zinc-400 my-2">2026-05-06 10:42:07</div>

              <ChatMessage
                role="user"
                time="2026-05-06 10:42:07"
                name={chatDisplayName}
                content="想"
              />

              <div className="text-center text-xs text-zinc-400 my-2">2026-05-06 10:42:15 AI-生成群线索</div>

              <div className="text-center text-xs text-zinc-400 my-2">2026-05-06 10:42:20 运营-生成群线索</div>

              <div className="text-center text-xs text-zinc-400 my-2">2026-05-06 10:42:30 运营-分配群线索</div>

              <div className="text-center text-xs text-zinc-400 my-2">2026-05-06 10:42:40</div>

              <ChatMessage
                role="ai"
                time="2026-05-06 10:42:40"
                name="选房分析师合合"
                content={`城建琥珀御熙府，3室2厅119.12㎡，满五年。该房源位于蜀山区井岗镇板块，户型为3室2厅1厨2卫，建筑面积119.12㎡。

琥珀御熙府这套房户型很正，我个人非常看好。业主议价空间我也清楚，您想深度了解吗？`}
              />

              <div className="flex justify-end">
                <PrivateHouseMiniProgramCard onContextMenu={handleMiniProgramContextMenu} />
              </div>

              <div className="text-center text-xs text-zinc-400 my-2">2026-05-06 10:43:16</div>

              <ChatMessage
                role="user"
                time="2026-05-06 10:43:16"
                name={chatDisplayName}
                content="好的收到，我看下哈"
              />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
              <div className="flex items-center gap-2 mb-2 text-zinc-500">
                <button className="flex items-center gap-1 text-xs hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <Command size={14} /> 快捷话术
                </button>
                <button className="p-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <Image size={16} />
                </button>
                <button className="p-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <FolderOpen size={16} />
                </button>
                <button className="p-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <Flame size={16} />
                </button>
                <button className="p-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <Users size={16} />
                </button>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <textarea
                    placeholder="输入消息..."
                    rows={2}
                    className="w-full bg-transparent border-none focus:outline-none resize-none text-sm max-h-32"
                    onFocus={() => {
                      if (activeChatProfile?.receptionStatus === '线索承接' && !activeChatProfile?.hasConfirmedReception) {
                        setIsReceptionConfirmModalOpen(true);
                      }
                    }}
                  />
                </div>
                <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors h-[54px] w-[54px] flex items-center justify-center">
                  <Send size={18} />
                </button>
              </div>
            </div>
           </div>

           {/* Right Panel: Private Chat Tools */}
          <div className="hidden lg:flex w-[280px] border-l border-zinc-200 dark:border-zinc-800 flex-col shrink-0 bg-white dark:bg-zinc-950 overflow-y-auto">
            <div className="grid grid-cols-4 gap-1.5 p-2.5 border-b border-[#e7eff7] dark:border-zinc-800 bg-[#f3f8fc] dark:bg-zinc-900/50" aria-label="私聊右侧工具栏">
              {privateRightPanelTabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  title={tab.title}
                  aria-label={tab.title}
                  aria-pressed={activeRightPanelTab === tab.id}
                  onClick={() => setActiveRightPanelTab(tab.id)}
                  className={`relative h-7 rounded-sm text-xs font-medium transition-colors ${activeRightPanelTab === tab.id ? 'bg-white border border-blue-300 text-blue-600 shadow-[0_1px_2px_rgba(37,99,235,0.06)] dark:bg-zinc-800 dark:border-blue-800 dark:text-blue-400' : 'bg-zinc-100/90 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/80 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800'}`}
                >
                  {tab.label}
                  {tab.hasNotice && <span className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-orange-500" aria-label="有待处理追问任务" />}
                </button>
              ))}
            </div>

            {activeRightPanelTab === '客户档案' && (
              <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900/50 flex flex-col">
                <div className="p-3 flex justify-between items-center text-xs text-zinc-500">
                  <span>更新时间：2026-03-31 07:54:52</span>
                  <button className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                    <RefreshCw size={12} /> 刷新档案
                  </button>
                </div>

                <div className="p-3 flex flex-col gap-3">
                  {privateArchiveFields.map((field, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs text-zinc-500">{field.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${field.tag === '固定' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                          {field.tag}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{field.value}</div>
                      <div className="text-[10px] text-zinc-400 mt-2">{field.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRightPanelTab === '客户画像' && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-orange-100 shrink-0">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop" alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">{activeChatProfile?.name || privatePortraitSummary.name}</div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {activeChatProfile?.status || privatePortraitSummary.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            {activeChatProfile?.source || privatePortraitSummary.source}
                          </span>
                          <span className="text-[10px] text-zinc-400">{activeChatProfile?.subtitle || privatePortraitSummary.subtitle}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCustomerMoreMenuOpen(!isCustomerMoreMenuOpen)}
                      className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  {isCustomerMoreMenuOpen && (
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => {
                          setIsCustomerMoreMenuOpen(false);
                          setIsBlacklistModalOpen?.(true);
                        }}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        加入黑名单
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-4">基础信息</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: '手机号', value: activeChatProfile?.phone || privatePortraitBasicInfo[0].value },
                      { label: 'base_id', value: activeChatProfile?.baseId || privatePortraitBasicInfo[1].value },
                      { label: 'unionid', value: activeChatProfile?.unionid || privatePortraitBasicInfo[2].value },
                      { label: '788ID', value: activeChatProfile?.id788 || privatePortraitBasicInfo[3].value },
                      { label: 'ch', value: activeChatProfile?.ch || privatePortraitBasicInfo[4].value }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 text-xs">
                        <span className="text-zinc-500 shrink-0">{item.label}</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-zinc-900 dark:text-zinc-100 truncate">{item.value}</span>
                          <Copy className="w-3 h-3 text-zinc-400 cursor-pointer hover:text-zinc-600 shrink-0" />
                        </div>
                      </div>
                    ))}
                    <div className="relative">
                      <div className="flex items-start justify-between gap-3 text-xs">
                        <span className="text-zinc-500 shrink-0">添加时间</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-zinc-900 dark:text-zinc-100 truncate">{activeChatProfile?.friendAddedAt || privateFriendRelationRecords[0].time}</span>
                          {privateFriendRelationRecords.length > 1 && (
                            <button
                              onClick={() => setIsFriendRelationOpen(prev => !prev)}
                              className={`h-5 w-5 rounded-md flex items-center justify-center transition-colors ${isFriendRelationOpen ? 'bg-blue-50 text-blue-600' : 'text-blue-500 hover:bg-blue-50'}`}
                              title="查看好友关系记录"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      {isFriendRelationOpen && (
                        <div className="mt-2 rounded-lg border border-blue-100 bg-white dark:bg-zinc-950 shadow-[0_8px_24px_rgba(37,99,235,0.12)] p-3">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">好友关系记录</span>
                            <button
                              onClick={() => setIsFriendRelationOpen(false)}
                              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="space-y-3">
                            {privateFriendRelationRecords.map((record, index) => (
                              <div key={`${record.type}-${record.time}`} className="flex gap-2 text-xs">
                                <div className="flex flex-col items-center pt-1">
                                  <span className={`w-1.5 h-1.5 rounded-full ${record.type === 'add' ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                                  {index < privateFriendRelationRecords.length - 1 && <span className="w-px flex-1 min-h-[28px] bg-zinc-200 mt-1" />}
                                </div>
                                <div className="min-w-0">
                                  <div className={`font-semibold ${record.type === 'add' ? 'text-emerald-600' : 'text-zinc-700 dark:text-zinc-300'}`}>{record.title}</div>
                                  <div className="mt-0.5 text-zinc-400">{record.time}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-4">客户标签</h3>
                  <div className="mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs text-zinc-500 mb-2">暂停跟进用户</div>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div
                          onClick={() => setIsAbnormalTagDropdownOpen(!isAbnormalTagDropdownOpen)}
                          className={`flex-1 bg-white dark:bg-zinc-900 border ${isAbnormalTagDropdownOpen ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-md px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 cursor-pointer flex items-center justify-between transition-colors`}
                        >
                          <span className={(pendingAbnormalTag !== undefined ? pendingAbnormalTag : activeChatProfile?.abnormalTag) ? '' : 'text-zinc-400'}>
                            {(pendingAbnormalTag !== undefined ? pendingAbnormalTag : activeChatProfile?.abnormalTag) || '无异常'}
                          </span>
                          <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isAbnormalTagDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {pendingAbnormalTag !== undefined && pendingAbnormalTag !== activeChatProfile?.abnormalTag && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={confirmAbnormalTagChange}
                              className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                              title="确认修改"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setPendingAbnormalTag(undefined)}
                              className="w-7 h-7 flex items-center justify-center bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-md transition-colors"
                              title="取消修改"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      {isAbnormalTagDropdownOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg z-[60] py-1">
                          <div
                            onClick={() => {
                              setPendingAbnormalTag(null);
                              setIsAbnormalTagDropdownOpen(false);
                            }}
                            className={`px-4 py-2 text-xs cursor-pointer ${((pendingAbnormalTag !== undefined ? pendingAbnormalTag : activeChatProfile?.abnormalTag) === null) ? 'bg-zinc-50 dark:bg-zinc-700/50 text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'}`}
                          >
                            无异常
                          </div>
                          {abnormalUserOptions.map(option => (
                            <div
                              key={option}
                              onClick={() => {
                                setPendingAbnormalTag(option);
                                setIsAbnormalTagDropdownOpen(false);
                              }}
                              className={`px-4 py-2 text-xs cursor-pointer ${((pendingAbnormalTag !== undefined ? pendingAbnormalTag : activeChatProfile?.abnormalTag) === option) ? 'bg-zinc-50 dark:bg-zinc-700/50 text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'}`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-2">语料标签</div>
                      <div className="flex flex-wrap gap-2">
                        {privatePortraitMaterialTags.map((tag, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-1 rounded-full border ${renderTagChipClass(tag.tone)}`}
                          >
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-2">CDP标签</div>
                      <div className="flex flex-wrap gap-2">
                        {privatePortraitCdpTags.map((tag, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-1 rounded-full border ${renderTagChipClass(tag.tone)}`}
                          >
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">跟进备注</h3>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <Plus size={12} className="bg-blue-500 text-white rounded-full p-0.5" /> 添加
                      </button>
                      <button className="hover:text-blue-600">查看全部</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {privateFollowUpNotes.map((item, i) => (
                      <div key={i} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
                        <div className="text-[10px] text-zinc-400 mb-1">{item.time}</div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-5">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeRightPanelTab === '用户记忆' && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 bg-[#f1f8fd] dark:bg-zinc-900/50">
                <button className="self-end -mb-1 flex items-center gap-1 text-xs text-[#4b89c8] hover:text-blue-600"><RefreshCw size={13} /> 刷新</button>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2"><span className="w-1.5 h-4 rounded-full bg-blue-500" /> 用户阶段</div>
                  <div className="rounded-md bg-white dark:bg-zinc-950 px-3 py-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-zinc-100"><span>当前阶段</span><ChevronDown size={15} className="rotate-180 text-zinc-400" /></div>
                    <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs text-blue-600 bg-blue-50">{privateUserMemory.stage}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2"><span className="w-1.5 h-4 rounded-full bg-blue-500" /> 长期记忆</div>
                  <div className="rounded-md bg-white dark:bg-zinc-950 px-3 py-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2"><span>硬约束</span><ChevronDown size={15} className="rotate-180 text-zinc-400" /></div>
                    <div className="space-y-1.5">
                      {privateUserMemory.longTermItems.map(item => <div key={item.label} className="rounded bg-zinc-50 px-2.5 py-2"><div className="text-[11px] text-zinc-400">{item.label}</div><div className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">{item.value}</div></div>)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2"><span className="w-1.5 h-4 rounded-full bg-blue-500" /> 候选记忆</div>
                  <div className="rounded-md bg-white dark:bg-zinc-950 px-3 py-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2"><span>当前购房需求</span><ChevronDown size={15} className="rotate-180 text-zinc-400" /></div>
                    <div className="space-y-1.5">
                      {privateUserMemory.candidateItems.map(item => <div key={item.label} className="rounded bg-zinc-50 px-2.5 py-2"><div className="text-[11px] text-zinc-400">{item.label}</div><div className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">{item.value}</div></div>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRightPanelTab === '客户行为' && (
              <div className="flex-1 overflow-y-auto p-3 bg-[#f1f8fd] dark:bg-zinc-900/50">
                <div className="relative pl-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-[#d8e6f3]">
                  {privateBehaviorItems.concat([
                    { title: '页面浏览-户型解析详情页-5秒', time: '2026-05-29 06:23:46', desc: '中交九宸，包河区/淝河板块，224.0万-479.0万/108.0㎡-189.0㎡' },
                    { title: '页面浏览-楼盘详情页-1秒', time: '2026-05-29 06:23:47', desc: '中交九宸，包河区/淝河板块，224.0万-479.0万/108.0㎡-189.0㎡' }
                  ]).map((item, i) => (
                    <div key={`${item.time}-${i}`} className="relative pb-4 last:pb-1">
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                      <div className="text-xs text-zinc-400">{item.time}</div>
                      <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-1 leading-5">{item.title}</div>
                      <div className="text-xs text-zinc-400 mt-1 leading-5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRightPanelTab === '追问任务' && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-[#f1f8fd] dark:bg-zinc-900/50">
                {privateFollowUpTasks.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-950 p-3.5 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between gap-2 text-sm text-orange-500"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-orange-50" /> 待发送</span><Copy size={16} className="text-zinc-500" /></div>
                    <div className="mt-3 rounded-md bg-[#f1f7fe] p-3 text-sm leading-5 text-zinc-700 dark:text-zinc-300">{item.text}</div>
                    <div className="mt-2 rounded-md bg-[#f1f7fe] p-3"><div className="flex items-center gap-1 text-xs text-blue-500"><Clock size={13} /> 预计发送时间</div><div className="text-sm text-blue-600 mt-1">2026-07-27 15:13:41</div></div>
                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-400"><span>生成于 14:33</span><button className="px-2.5 py-1 rounded border border-red-400 text-red-500 hover:bg-red-50">取消发送</button></div>
                    <div className="sr-only">{item.title} {item.time}</div>
                  </div>
                ))}
              </div>
            )}

            {activeRightPanelTab === '聊天记录' && (
              <div className="flex-1 overflow-y-auto p-3 bg-[#f8fafc] dark:bg-zinc-900/50">
                <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-2 gap-y-3 items-center text-xs text-zinc-500">
                  <label htmlFor="chat-keyword" className="text-right">聊天关键词：</label>
                  <input id="chat-keyword" className="h-7 w-full rounded-sm border border-[#d8dee8] bg-white px-2 text-xs text-zinc-700 outline-none focus:border-blue-400" />
                  <label htmlFor="chat-start" className="text-right">开始时间：</label>
                  <div className="relative"><Clock size={13} className="absolute left-2 top-2 text-zinc-400" /><input id="chat-start" className="h-7 w-full rounded-sm border border-[#d8dee8] bg-white pl-7 pr-2 text-xs text-zinc-700 outline-none focus:border-blue-400" /></div>
                  <label htmlFor="chat-end" className="text-right">结束时间：</label>
                  <div className="relative"><Clock size={13} className="absolute left-2 top-2 text-zinc-400" /><input id="chat-end" className="h-7 w-full rounded-sm border border-[#d8dee8] bg-white pl-7 pr-2 text-xs text-zinc-700 outline-none focus:border-blue-400" /></div>
                  <div />
                  <button className="justify-self-end h-8 rounded-sm bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700">查询</button>
                </div>
              </div>
            )}

            {activeRightPanelTab === '流转记录' && (
              <div className="flex-1 overflow-y-auto p-3 bg-[#f8fafc] dark:bg-zinc-900/50">
                <div className="relative pl-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-[#d8e0ea]">
                  {privateFlowRecords.map((item, i) => (
                    <div key={i} className="relative pb-4 last:pb-1">
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                      <div className="text-xs text-zinc-400">{item.time}</div>
                      <div className="mt-2 space-y-1 text-sm text-zinc-800 dark:text-zinc-100"><div>接待人：{item.receiver}</div><div>操作人：{item.operator}</div></div>
                      <div className="mt-1 text-xs text-zinc-400">流转原因：{item.reason}</div>
                    </div>
                ))}
              </div>
              </div>
            )}

            {activeRightPanelTab === '配房记录' && canViewPrivateMatchRecords && (
              <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900/50 flex flex-col">
                {activePrivateMatchRecordState === 'loading' && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                    <Loader2 size={24} className="animate-spin text-blue-500" />
                    <div className="text-xs text-zinc-500">正在加载配房记录…</div>
                  </div>
                )}

                {activePrivateMatchRecordState === 'error' && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/20 dark:text-rose-400 flex items-center justify-center">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">配房记录加载失败</div>
                      <div className="text-xs text-zinc-500 mt-1">暂时无法获取配房记录，请稍后重试</div>
                    </div>
                    <button onClick={refreshPrivateMatchRecords} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">重新加载</button>
                  </div>
                )}

                {activePrivateMatchRecordState === 'ready' && activePrivateMatchRecords.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">暂无已确认发送的配房记录</div>
                      <div className="text-xs text-zinc-500 mt-1">房源组装完成并确认发送给用户后，会在这里按时间沉淀</div>
                    </div>
                  </div>
                )}

                {activePrivateMatchRecordState === 'ready' && activePrivateMatchRecords.length > 0 && (
                  <div className="p-3 flex flex-col gap-3">
                    {activePrivateMatchRecords.map(record => (
                      <section key={record.id} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                        <div className="px-2.5 pt-2 text-[10px] text-zinc-400">配房时间：{record.time}</div>
                        <div className="p-2.5 flex flex-col gap-2.5">
                          {record.properties.map(property => (
                            <article
                              key={property.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setIsPrivateMatchImagePreviewOpen(false);
                                setSelectedPrivateMatchProperty(property);
                              }}
                              onKeyDown={event => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  setIsPrivateMatchImagePreviewOpen(false);
                                  setSelectedPrivateMatchProperty(property);
                                }
                              }}
                              className="rounded-md border border-zinc-100 dark:border-zinc-800 p-2 cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <img src={property.cover} alt="" className="w-10 h-10 rounded object-cover shrink-0 bg-zinc-100" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 leading-4 line-clamp-2">{property.title}</div>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{property.source}</span>
                                    {property.hasIntent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">有意向</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[10px]">
                                <span className="text-zinc-500 truncate">{formatPrivateMatchValue(property.community)}</span>
                                <span className="text-zinc-500 text-right truncate">{formatPrivateMatchValue(property.layout)} · {formatPrivateMatchValue(property.area)}</span>
                                <span className="font-semibold text-rose-500">{formatPrivateMatchValue(property.totalPrice)}</span>
                                <span className="text-zinc-500 text-right">{formatPrivateMatchValue(property.unitPrice)}</span>
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedPrivateMatchProperty && canViewPrivateMatchRecords && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/35 flex justify-end" onClick={() => {
                setIsPrivateMatchImagePreviewOpen(false);
                setSelectedPrivateMatchProperty(null);
              }}>
                <motion.aside initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} className="w-full max-w-[380px] h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col" onClick={event => event.stopPropagation()}>
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">房源详情</div>
                      <div className="text-[10px] text-zinc-400 mt-1">{selectedPrivateMatchPropertyIndex + 1} / {activePrivateMatchProperties.length}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (hasPreviousPrivateMatchProperty) {
                            setIsPrivateMatchImagePreviewOpen(false);
                            setSelectedPrivateMatchProperty(activePrivateMatchProperties[selectedPrivateMatchPropertyIndex - 1]);
                          }
                        }}
                        disabled={!hasPreviousPrivateMatchProperty}
                        className="p-1.5 rounded text-zinc-500 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent dark:hover:bg-zinc-800 dark:disabled:text-zinc-700"
                        title="查看上一套房源"
                        aria-label="查看上一套房源"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (hasNextPrivateMatchProperty) {
                            setIsPrivateMatchImagePreviewOpen(false);
                            setSelectedPrivateMatchProperty(activePrivateMatchProperties[selectedPrivateMatchPropertyIndex + 1]);
                          }
                        }}
                        disabled={!hasNextPrivateMatchProperty}
                        className="p-1.5 rounded text-zinc-500 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent dark:hover:bg-zinc-800 dark:disabled:text-zinc-700"
                        title="查看下一套房源"
                        aria-label="查看下一套房源"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <button onClick={() => {
                        setIsPrivateMatchImagePreviewOpen(false);
                        setSelectedPrivateMatchProperty(null);
                      }} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500" title="关闭详情" aria-label="关闭详情"><X size={18} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <button onClick={() => setIsPrivateMatchImagePreviewOpen(true)} className="group relative block w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400" title="查看大图" aria-label="查看房源大图">
                      <img src={selectedPrivateMatchProperty.cover} alt="房源封面" className="w-full h-48 object-cover bg-zinc-100 transition-transform duration-200 group-hover:scale-[1.02]" />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-3">
                        <span className="opacity-0 group-hover:opacity-100 text-[11px] text-white bg-black/55 rounded px-2 py-1 transition-opacity">点击查看大图</span>
                      </span>
                    </button>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{selectedPrivateMatchProperty.source}</span>
                      {selectedPrivateMatchProperty.hasIntent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">有意向</span>}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-7 text-zinc-900 dark:text-zinc-100">{selectedPrivateMatchProperty.title}</h3>
                    <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10">
                      <div><div className="text-lg font-bold text-rose-500">{formatPrivateMatchValue(selectedPrivateMatchProperty.totalPrice)}</div><div className="text-[10px] text-zinc-500 mt-1">总价</div></div>
                      <div><div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{formatPrivateMatchValue(selectedPrivateMatchProperty.layout)}</div><div className="text-[10px] text-zinc-500 mt-1">户型</div></div>
                      <div><div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{formatPrivateMatchValue(selectedPrivateMatchProperty.area)}</div><div className="text-[10px] text-zinc-500 mt-1">面积</div></div>
                    </div>
                    <div className="mt-5 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                      {[
                        ['单价', selectedPrivateMatchProperty.unitPrice],
                        ['小区', selectedPrivateMatchProperty.community],
                        ['类型', selectedPrivateMatchProperty.propertyType],
                        ['产权', selectedPrivateMatchProperty.ownership],
                        ['朝向', selectedPrivateMatchProperty.orientation],
                        ['电梯', selectedPrivateMatchProperty.elevator],
                        ['楼层', selectedPrivateMatchProperty.floor],
                        ['抵押', selectedPrivateMatchProperty.mortgage]
                      ].map(([label, value]) => (
                        <div key={label} className="px-3 py-3 flex items-start justify-between gap-4 text-xs">
                          <span className="text-zinc-500 shrink-0">{label}</span>
                          <span className="text-right text-zinc-800 dark:text-zinc-100">{formatPrivateMatchValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isPrivateMatchImagePreviewOpen && selectedPrivateMatchProperty && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-8" onClick={() => setIsPrivateMatchImagePreviewOpen(false)}>
                <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="relative max-w-5xl max-h-full" onClick={event => event.stopPropagation()}>
                  <img src={selectedPrivateMatchProperty.cover} alt="房源大图" className="max-h-[85vh] max-w-[88vw] rounded-lg object-contain shadow-2xl" />
                  <button onClick={() => setIsPrivateMatchImagePreviewOpen(false)} className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white text-zinc-700 shadow-lg flex items-center justify-center" title="关闭大图" aria-label="关闭大图"><X size={18} /></button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (featureRouteTitle === '[AI] 合肥100w学区房') return <AudiencePackageDetail key={featureRouteTitle} displayName={activeTab.title}/>;

    if (featureRouteTitle === '[AI] 合肥100w学区房群') {
      return (
        <div className="w-full h-full bg-white dark:bg-zinc-950 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 p-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{activeTab.title}</h2>
              <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
                <span>预估群聊数: 1001 个</span>
                <span>|</span>
                <span>圈选条件: 合肥市/意向价格100-200万/学区房</span>
                <span>|</span>
                <span>创建人: 张三</span>
                <span>|</span>
                <span>创建时间: 2026-03-05 10:00:00</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">群名称</th>
                    <th className="px-4 py-3 font-medium">room ID</th>
                    <th className="px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {selectionGroupSamples.map((group, i) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/20">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{group.name}</td>
                      <td className="px-4 py-3 text-zinc-500 font-mono">{group.id}</td>
                      <td className="px-4 py-3"><button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline" onClick={() => { setSelectedUserTab('群档案'); setSelectedUser(group.name); }}>群聊详情</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AnimatePresence>
            {selectedUser && selectionGroupByName(selectedUser) && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-black z-10" />
                <motion.aside role="dialog" aria-label="群聊详情" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[420px] max-w-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-20 shadow-xl flex flex-col">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center gap-2 shrink-0">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">群聊详情</h3>
                    <div className="flex items-center gap-2">
                      <button title="上一个群聊" aria-label="上一个群聊" disabled={selectionGroupSamples.findIndex(item => item.name === selectedUser) <= 0} onClick={() => { const index = selectionGroupSamples.findIndex(item => item.name === selectedUser); if (index > 0) setSelectedUser(selectionGroupSamples[index - 1].name); }} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronLeft size={16} /></button>
                      <span className="text-xs text-zinc-500">{selectionGroupSamples.findIndex(item => item.name === selectedUser) + 1} / {selectionGroupSamples.length}</span>
                      <button title="下一个群聊" aria-label="下一个群聊" disabled={selectionGroupSamples.findIndex(item => item.name === selectedUser) >= selectionGroupSamples.length - 1} onClick={() => { const index = selectionGroupSamples.findIndex(item => item.name === selectedUser); if (index < selectionGroupSamples.length - 1) setSelectedUser(selectionGroupSamples[index + 1].name); }} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronRight size={16} /></button>
                      <button onClick={() => setSelectedUser(null)} aria-label="关闭群聊详情" className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><X size={16} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4"><GroupCustomerInfo group={selectionGroupByName(selectedUser)!} tab={selectedUserTab} onTabChange={setSelectedUserTab} /></div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (featureRouteTitle.includes('每日私聊推送_学区房名单')) {
      return <PushTaskDetailView task={{...legacyAudiencePushTask,name:activeTab.title}}/>;
    }

    if (featureRouteTitle.includes('群推送_映象星潮')) {
      return (
        <div className="w-full h-full bg-white dark:bg-zinc-950 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 p-4 shrink-0">
             <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
               <Send size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">推送任务详情</h2>
                <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
                  <span>TASK_ID: 24581</span>
                  <span>|</span>
                  <span>推送状态: 已推送</span>
                  <span>|</span>
                  <span>创建人: AI助手</span>
                  <span>|</span>
                  <span>创建时间: 2026-03-31 08:43:00</span>
                </div>
              </div>
          </div>

          <div className="p-6 space-y-8 max-w-5xl">
            {/* Basic Info */}
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-4">基本信息</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-12 text-sm">
                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">TASK_ID:</span><span className="text-zinc-900 dark:text-zinc-100">24581</span></div>
                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">推送状态:</span><span className="text-zinc-900 dark:text-zinc-100">已推送</span></div>

                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">名称:</span><span className="text-zinc-900 dark:text-zinc-100">{activeTab.title}</span></div>
                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">主题:</span><span className="text-zinc-900 dark:text-zinc-100">新房</span></div>

                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">推送时间:</span><span className="text-zinc-900 dark:text-zinc-100">即时推送 2026-03-31 08:43:37</span></div>

                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">推送间隔:</span><span className="text-zinc-900 dark:text-zinc-100">0-0</span></div>

                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">通道:</span><span className="text-zinc-900 dark:text-zinc-100">企微群聊-光年本地 (南京新房)</span></div>
                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">免打扰时段:</span><span className="text-zinc-900 dark:text-zinc-100">22:00:00-08:00:00</span></div>

                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">优先级:</span><span className="text-zinc-900 dark:text-zinc-100">1</span></div>
              </div>
            </section>

            {/* Recipients */}
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-4">收件人</h3>
              <div className="space-y-4 text-sm">
                <div className="flex"><span className="text-zinc-500 w-24 shrink-0">接收群:</span><span className="text-zinc-900 dark:text-zinc-100">南京AI控制台验证群</span></div>
              </div>
            </section>

            {/* Senders */}
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-4">发送人</h3>
              <div className="flex text-sm">
                <span className="text-zinc-500 w-24 shrink-0">发送人:</span>
                <div className="text-zinc-900 dark:text-zinc-100">
                  365房博士好好
                </div>
              </div>
            </section>

            {/* Push Content */}
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-4">推送内容</h3>
              <div className="space-y-6 text-sm">

                {/* Message 1 */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="flex"><span className="text-zinc-500 w-24 shrink-0">信息1类型:</span><span className="text-zinc-900 dark:text-zinc-100">文本</span></div>
                     <div className="flex"><span className="text-zinc-500 w-24 shrink-0">发送延时:</span><span className="text-zinc-900 dark:text-zinc-100">0秒</span></div>
                   </div>
                   <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
                     <span className="text-zinc-500 w-24 shrink-0">信息1内容:</span>
                     <div className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap leading-relaxed">
                       🏢江核低密洋房+四代宅<br/>
                       🚇双地铁+金陵中学分校<br/>
                       💥实用率最高可达109%<br/>
                       💰现在单价2万多就能入手<br/>
                       👉详细测评已出炉，点击查看{"{path1}"}
                     </div>
                     <a href="#" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap">查看链接</a>
                   </div>
                </div>

                {/* Message 2 */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="flex"><span className="text-zinc-500 w-24 shrink-0">信息2类型:</span><span className="text-zinc-900 dark:text-zinc-100">淘房小程序</span></div>
                     <div className="flex"><span className="text-zinc-500 w-24 shrink-0">发送延时:</span><span className="text-zinc-900 dark:text-zinc-100">5秒</span></div>
                   </div>
                   <div className="flex gap-4">
                     <span className="text-zinc-500 w-24 shrink-0">信息2内容:</span>
                     <div className="text-zinc-900 dark:text-zinc-100 space-y-2">
                       <div><span className="text-zinc-500 mr-2">标题:</span>单价2万多一平 江核四代宅详细测评出炉</div>
                       <div className="break-all"><span className="text-zinc-500 mr-2">小程序路径:</span>page/newhouse/evaluation/evaluation.html?city=nj&pinyin=xinjiansheG13dikuai&jumpmark=evaluation&share_url=&share_depth=1</div>
                     </div>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-zinc-500 w-24 shrink-0">小程序卡片封面:</span>
                      <div className="w-48 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                         <div className="text-zinc-400 flex flex-col items-center gap-2">
                            <ImageIcon size={24} />
                            <span className="text-xs">封面图片</span>
                         </div>
                      </div>
                    </div>
                </div>

              </div>
            </section>
          </div>
        </div>
      );
    }

    const group = groupList.find(g => g.name === activeTab.title);
    if (group) {
      return (
        <div className="flex h-full w-full bg-[#eaf4ff]">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-16 flex items-center justify-between px-5 shrink-0 bg-[#eaf4ff]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[17px] text-[#102a4c] truncate">{group.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e7f3ff] text-[#1683ff] border border-[#c9e3ff]">{group.service}</span>
                </div>
                <div className="mt-1 text-xs text-[#5f7892] truncate">
                  {group.city} | 群主：选房分析师霏霏 | {group.source} | 服务客户：再回首 | 经纪人：{group.agent}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5 bg-[#eaf4ff]">
              <div className="text-center text-xs text-[#9db4ca]">2026-05-09 15:47:16</div>
              {/* V4.7：沿用历史灰色系统消息样式展示 AI/运营生成线索节点。 */}
              <div className="text-center text-xs text-[#9db4ca] my-1">2026-05-09 15:47:20 AI-生成群线索</div>
              <div className="flex items-start gap-3 max-w-[70%]">
                <img src={group.avatar} className="w-9 h-9 rounded-full border border-white object-cover" alt="" />
                <div>
                  <div className="text-xs text-[#7d96b2] mb-1">杨玉银13696510313　2026-05-09 15:47:16</div>
                  <div className="w-28 h-28 rounded-md bg-white border border-[#d8e5f4] p-2 shadow-sm">
                    <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=220&h=220&q=80" className="w-full h-full object-cover rounded" alt="" />
                  </div>
                </div>
              </div>
              <ChatMessage role="user" time="2026-05-09 15:47:41" name="杨玉银13696510313" content="您先看下120平户型图" />
              <div className="flex items-start gap-3 max-w-[70%]">
                <img src={group.avatar} className="w-9 h-9 rounded-full border border-white object-cover" alt="" />
                <div>
                  <div className="text-xs text-[#7d96b2] mb-1">杨玉银13696510313　2026-05-09 15:52:41</div>
                  <div className="w-28 h-28 rounded-md bg-white border border-[#d8e5f4] p-2 shadow-sm">
                    <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=220&h=220&q=80" className="w-full h-full object-cover rounded" alt="" />
                  </div>
                </div>
              </div>
              <ChatMessage role="ai" time="2026-05-09 15:57:58" name="再回首" isHumanOp content="哪个小区？" />
              <ChatMessage role="user" time="2026-05-09 15:58:42" name="杨玉银13696510313" content="中骏世界城和皖投云启华章" />
              <ChatMessage role="user" time="2026-05-10 09:53:13" name="杨玉银13696510313" content="@再回首 您好！昨天给您推荐的新房今天周末可考虑出来看房呢" />
            </div>

            <div className="p-4 bg-[#eaf4ff] shrink-0">
              <div className="rounded-lg bg-white border border-[#e5eef8] h-40 flex flex-col justify-end px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8ba7c3]">
                    <button className="p-1 hover:text-[#1683ff]"><ImageIcon size={17} /></button>
                    <button className="p-1 hover:text-[#1683ff]"><FolderOpen size={17} /></button>
                    <button className="p-1 hover:text-[#1683ff]"><Smile size={17} /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="h-8 px-3 rounded-full border border-[#d8e5f4] text-xs text-[#7d96b2] hover:border-[#9acbff] hover:text-[#1683ff]">选择发送消息的客服账号</button>
                    <button className="w-9 h-9 rounded-full bg-[#1683ff] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[330px] border-l border-[#dbe8f7] bg-[#f6fbff] flex flex-col shrink-0">
            {/* V4.7：群聊右侧新增“流转记录”入口。 */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-white border-b border-[#dbe8f7] text-sm">
              {['群档案', '群详情', '客户档案', '快捷话术', '聊天记录', '流转记录'].map(tab => {
                const canSwitch = tab === '群档案' || tab === '流转记录';
                const isActive = activeGroupRightPanelTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => canSwitch && setActiveGroupRightPanelTab(tab as '群档案' | '流转记录')}
                    className={`h-9 rounded-sm transition-colors ${
                      isActive
                        ? 'bg-[#e7f3ff] text-[#1683ff] border border-[#9acbff]'
                        : 'bg-[#f4f8fc] text-[#31506f] hover:bg-[#e7f3ff]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeGroupRightPanelTab === '群档案' && (
              <>
                <div className="px-3 py-2 text-xs text-[#7d96b2] flex justify-between">
                  <span>更新时间：2026-05-10 09:53:56</span>
                  <button className="text-[#1683ff] flex items-center gap-1"><RefreshCw size={12} />刷新档案</button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
                  {[
                    { title: '群聊总结', icon: null, text: '用户明确寻找一梯一户、室内120平以上的房源，预算200万左右，坚决拒收回迁房。对已推的金隅大成都133平房源反馈户型不佳。目前经纪人已推送中骏世界城与皖投云启华章户型图，并正发起周末看房邀约。' },
                    { title: '运营跟进建议', icon: <MessageSquare size={15} className="text-orange-500" />, text: '需及时核实用户对新房源户型的满意度，防止沟通断档；督促经纪人于24小时内落实带看时标，并针对客户对户型规划的特点，筛选边套或高赠送等优惠排口径备选。' },
                    { title: '分销中介跟进建议', icon: <User size={15} className="text-[#1683ff]" />, text: '严选室内120平以上且具备私密入户感的房源，避免高公摊户型；带看时重点演示中骏及皖投的电梯入户优势，利用200万预算下一梯一户的稀缺性引导客户通过横厅尺度对比消除不满。' }
                  ].map(item => (
                    <div key={item.title} className="bg-white rounded-md border border-[#e5eef8] p-4">
                      <div className="flex items-center gap-2 mb-2 font-semibold text-[#102a4c]">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <div className="text-sm leading-6 text-[#31506f]">{item.text}</div>
                    </div>
                  ))}

                  <div className="bg-white rounded-md border border-[#e5eef8] p-4">
                    <div className="font-semibold text-[#102a4c] mb-3">客户意向</div>
                    {[
                      ['决策人', '本人'],
                      ['学区意向', '未提及'],
                      ['当前阶段', '带看邀约中'],
                      ['意向价格', '200万左右']
                    ].map(([label, value]) => (
                      <div key={label} className="bg-[#f7fbff] rounded-md px-3 py-2 mb-2 last:mb-0">
                        <div className="text-xs text-[#9db4ca] mb-1">{label}</div>
                        <div className="text-sm text-[#31506f]">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeGroupRightPanelTab === '流转记录' && (
              <div className="flex-1 overflow-y-auto bg-[#f8fbff] px-4 py-4">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[#102a4c]">群线索流转记录</div>
                  <div className="mt-1 text-xs leading-5 text-[#7d96b2]">记录线索生成、接入、承接、到期及服务经纪人变更过程</div>
                </div>
                <div className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-3 before:w-px before:bg-[#cfe0f2]">
                  {[
                    {
                      title: '更换服务经纪人',
                      time: '2026-05-10 10:05:18',
                      operator: '合肥运营-王芳',
                      summary: '服务经纪人由郭华峰变更为杨玉银',
                      details: [['原服务经纪人', '郭华峰'], ['新服务经纪人', group.agent], ['变更原因', '原经纪人承接到期']]
                    },
                    {
                      title: '线索承接到期',
                      time: '2026-05-10 09:50:00',
                      operator: '系统',
                      summary: '原小B承接周期已到期，进入待重新承接状态',
                      details: [['到期小B', '郭华峰'], ['到期原因', '承接有效期结束']]
                    },
                    {
                      title: '小B开始承接',
                      time: '2026-05-09 15:50:12',
                      operator: '郭华峰',
                      summary: '小B已确认接入并开始服务该群客户',
                      details: [['承接状态', '承接中'], ['服务群', group.name]]
                    },
                    {
                      title: '线索接入小B',
                      time: '2026-05-09 15:48:06',
                      operator: '合肥运营-陈晨',
                      summary: '线索已分配至小B郭华峰',
                      details: [['小B姓名', '郭华峰'], ['小B ID', '7881301734908127'], ['所属公司/门店', '乐屋 / 创新产业园店'], ['承接有效期', '2026-05-09 15:48 至 2026-05-10 09:50']]
                    },
                    {
                      title: 'AI/运营生成线索',
                      time: '2026-05-09 15:47:20',
                      operator: 'AI找房',
                      summary: '根据客户购房意向自动生成群线索',
                      details: [['生成方式', 'AI自动识别'], ['线索来源', group.source], ['服务客户', '再回首']]
                    }
                  ].map((item, index) => (
                    <div key={item.title} className="relative pb-5 last:pb-0">
                      <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-[3px] border-[#f8fbff] ${index === 0 ? 'bg-[#1683ff]' : 'bg-[#8fbce8]'}`} />
                      <div className="rounded-md border border-[#e0ebf6] bg-white p-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-semibold text-[#102a4c]">{item.title}</div>
                          {index === 0 && <span className="shrink-0 rounded bg-[#e7f3ff] px-1.5 py-0.5 text-[10px] text-[#1683ff]">最新</span>}
                        </div>
                        <div className="mt-1 text-[11px] text-[#9db4ca]">{item.time}</div>
                        <div className="mt-2 text-xs leading-5 text-[#31506f]">{item.summary}</div>
                        <div className="mt-2 rounded bg-[#f7fbff] px-2.5 py-2 space-y-1.5">
                          {item.details.map(([label, value]) => (
                            <div key={label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-2 text-xs leading-4">
                              <span className="text-[#7d96b2]">{label}</span>
                              <span className="break-words text-[#31506f]">{value}</span>
                            </div>
                          ))}
                          <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2 text-xs leading-4">
                            <span className="text-[#7d96b2]">节点操作人</span>
                            <span className="break-words text-[#31506f]">{item.operator}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return <div className="p-6">Feature Not Implemented</div>;
  };

  return (
    <div className="flex h-screen w-full bg-[#eaf4ff] text-zinc-900 dark:text-zinc-100 overflow-hidden text-sm relative" onClick={closeContextMenu}>
      {customGroupNotice && (
        <div className="fixed top-4 right-4 z-[80] max-w-[360px] rounded-lg border border-[#c9e3ff] bg-white px-4 py-3 text-xs text-[#31506f] shadow-[0_10px_30px_rgba(16,42,76,0.18)]">
          {customGroupNotice}
        </div>
      )}
      {/* Thin Left Rail */}
      <div className="w-16 border-r border-[#dbe8f7] bg-[#f6fbff] flex flex-col items-center py-4 gap-4 z-10 shrink-0">
         <div className="w-10 h-10 rounded-xl bg-[#1683ff] items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 mb-2 hidden">AI</div>

         <div
           onClick={() => setActiveModule('chat')}
           className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
             activeModule === 'chat'
               ? 'bg-[#e7f3ff] text-[#1683ff] shadow-sm border border-[#c9e3ff]'
               : 'text-[#1683ff] hover:bg-[#e7f3ff]'
           }`}
         >
           <MessageSquare size={20} />
         </div>

         <div
           onClick={() => setActiveModule('groups')}
           className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
             activeModule === 'groups'
               ? 'bg-[#e7f3ff] text-[#1683ff] shadow-sm border border-[#c9e3ff]'
               : 'text-[#1683ff] hover:bg-[#e7f3ff]'
           }`}
           title="群聊"
         >
           <Users size={20} />
         </div>

         <div
           onClick={() => setActiveModule('moments')}
           className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
             activeModule === 'moments'
               ? 'bg-[#e7f3ff] text-[#1683ff] shadow-sm border border-[#c9e3ff]'
               : 'text-[#1683ff] hover:bg-[#e7f3ff]'
           }`}
           title="朋友圈"
         >
           <Compass size={20} />
         </div>

         <div className="mt-auto mb-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSidebarOpen ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#7d96b2] hover:bg-[#e7f3ff] hover:text-[#1683ff]'}`}
            >
              <Bot size={20} />
            </button>
         </div>
      </div>

      {/* Group List Panel */}
      {isGroupPanelOpen && !isAutomationPage && (
        <div className="hidden lg:flex w-[180px] border-r border-[#dbe8f7] bg-[#f3f9ff] flex-col shrink-0">
          <div className="p-4 flex items-center gap-2 font-semibold text-[#102a4c]">
            <button
              onClick={() => setIsGroupPanelOpen(false)}
              className="text-[#7d96b2] hover:text-[#1683ff] hover:bg-[#e7f3ff] transition-colors p-1 -ml-1 rounded"
              title="收起分组"
            >
              <ListFilter size={18} />
            </button>
            {activeModule === 'moments' ? '动态筛选' : '会话分组'}
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {activeModule === 'chat' ? (
              <>
                <div onClick={() => setActiveChatFilter('all')} className={`mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${activeChatFilter === 'all' ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#eaf4ff]'}`}>
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-[2px]"></div>
                    <div className="bg-current rounded-[2px]"></div>
                    <div className="bg-current rounded-[2px]"></div>
                    <div className="bg-current rounded-[2px]"></div>
                  </div>
                  <span className="font-medium">全部</span>
                </div>

                <div className="mt-2">
                  <div className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors">
                    <Clock size={16} className="text-[#7d96b2]" />
                    <span className="flex-1">当前接待</span>
                    <ChevronDown size={14} className="text-[#7d96b2] rotate-180" />
                  </div>
                  <div className="flex flex-col py-1">
                    {['待分配', '运营', 'AI', '业务专家'].map(item => (
                      <div key={item} className="mx-3 pl-9 pr-3 py-1.5 rounded-md text-[#5f7892] hover:bg-[#eaf4ff] hover:text-[#1683ff] cursor-pointer text-sm transition-colors">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-1">
                  <div onClick={() => setIsLeadGroupExpanded(!isLeadGroupExpanded)} className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors">
                    <History size={16} className="text-[#7d96b2]" />
                    <span className="flex-1">线索待派发</span>
                    <ChevronDown size={14} className={`text-[#7d96b2] transition-transform ${isLeadGroupExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  {isLeadGroupExpanded && (
                    <div className="flex flex-col py-1">
                      <div onClick={() => setActiveChatFilter('lead_all')} className={`mx-3 pl-9 pr-3 py-1.5 rounded-md cursor-pointer text-sm flex items-center justify-between transition-colors ${activeChatFilter === 'lead_all' ? 'text-[#1683ff] bg-[#e7f3ff]' : 'text-[#5f7892] hover:bg-[#eaf4ff] hover:text-[#1683ff]'}`}>
                        <span>全部线索</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-[#7d96b2] border border-[#d8e5f4]">{leadUsers.length}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-1">
                  <div className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors">
                    <RefreshCw size={16} className="text-[#7d96b2]" />
                    <span className="flex-1">撮合流程中</span>
                  </div>
                </div>

                <div className="mt-1">
                  <div className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors">
                    <Clock size={16} className="text-[#7d96b2]" />
                    <span className="flex-1">待跟进需求</span>
                    <ChevronDown size={14} className="text-[#7d96b2] rotate-180" />
                  </div>
                  <div className="flex flex-col py-1">
                    {[
                      { label: '社群需求', filter: 'community_need' as const, count: communityNeedUsers.length },
                      { label: '朋友圈需求', filter: 'moments_need' as const, count: momentsNeedUsers.length },
                      { label: '转派后挖掘', filter: 'transfer_mining' as const, count: transferMiningUsers.length }
                    ].map(item => (
                      <div
                        key={item.filter}
                        onClick={() => setActiveChatFilter(item.filter)}
                        className={`mx-3 pl-9 pr-3 py-1.5 rounded-md cursor-pointer text-sm flex items-center justify-between transition-colors ${activeChatFilter === item.filter ? 'text-[#1683ff] bg-[#e7f3ff]' : 'text-[#5f7892] hover:bg-[#eaf4ff] hover:text-[#1683ff]'}`}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-[#7d96b2] border border-[#d8e5f4]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 自定义分组 */}
                <div className="mt-1">
                  <div className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors group/header">
                    <FolderPlus size={16} className="text-orange-500" />
                    <span className="flex-1">自定义分组</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openCreateCustomGroup(); }}
                      className="p-1 rounded opacity-0 group-hover/header:opacity-100 text-[#7d96b2] hover:text-orange-600 hover:bg-orange-50 transition-all"
                      title="新建自定义分组"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col py-1">
                    {customGroups.map(group => (
                      <div
                        key={group.id}
                        onClick={() => setActiveChatFilter(`custom:${group.id}`)}
                        className={`group/item mx-3 flex items-center justify-between pl-9 pr-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors relative ${activeCustomGroupId === group.id ? 'text-orange-600 bg-orange-50' : 'text-[#5f7892] hover:bg-[#eaf4ff] hover:text-orange-600'}`}
                      >
                        <span className="truncate flex-1">{group.name}</span>
                        {group.status === 'recalculating' ? (
                          <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-orange-600 shrink-0">
                            <Loader2 size={11} className="animate-spin" />
                            重新计算中
                          </span>
                        ) : (
                          <span className="ml-2 min-w-5 h-5 px-1.5 rounded-full bg-white border border-[#d8e5f4] text-[10px] text-[#7d96b2] flex items-center justify-center shrink-0 group-hover/item:hidden">
                            {group.members.length}
                          </span>
                        )}
                        {group.status === 'idle' && (
                        <div className="hidden group-hover/item:flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity absolute right-3 bg-[#eaf4ff]">
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewingLogicGroupId(group.id); }}
                            className="p-1 rounded text-zinc-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                            title="查看逻辑"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            data-testid="edit-custom-group"
                            onClick={(e) => { e.stopPropagation(); openEditCustomGroup(group); }}
                            className="p-1 rounded text-zinc-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                            title="编辑"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingGroupId(group.id); }}
                            className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="删除"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        )}
                      </div>
                    ))}
                    {customGroups.length === 0 && (
                      <div className="px-10 py-1.5 text-xs text-zinc-400">
                        暂无自定义分组
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : activeModule === 'moments' ? (
              <>
                <div onClick={() => setActiveMomentFilter('all')} className={`mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${activeMomentFilter === 'all' ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#eaf4ff]'}`}>
                  <ListFilter size={16} className={activeMomentFilter === 'all' ? 'text-current' : 'text-[#7d96b2]'} />
                  <span className="font-medium flex-1">全部动态</span>
                </div>

                <div className="mt-1">
                  <div onClick={() => setActiveMomentFilter('pending')} className={`mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${activeMomentFilter === 'pending' ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#eaf4ff]'}`}>
                    <MessageCircle size={16} className={activeMomentFilter === 'pending' ? 'text-current' : 'text-[#7d96b2]'} />
                    <span className="flex-1">待处理互动</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div onClick={() => setActiveGroupCategory('all')} className={`mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${activeGroupCategory === 'all' ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#eaf4ff]'}`}>
                  <LayoutGrid size={16} className={activeGroupCategory === 'all' ? 'text-current' : 'text-[#7d96b2]'} />
                  <span className="flex-1">全部</span>
                </div>

                <div className="mt-1">
                  <div onClick={() => setActiveGroupCategory('delivery')} className={`mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${activeGroupCategory === 'delivery' || activeGroupCategory === 'delivery_private' || activeGroupCategory === 'delivery_targeted' ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#eaf4ff]'}`}>
                    <UserPlus size={16} className="text-current" />
                    <span className="flex-1 font-medium">交付群</span>
                    <ChevronDown size={14} className="text-current rotate-180" />
                  </div>
                  <div className="flex flex-col py-1">
                    {[
                      { label: '私聊撮合建群', value: 'delivery_private' as const },
                      { label: '定向房源建群', value: 'delivery_targeted' as const }
                    ].map(item => (
                      <div key={item.value} onClick={() => setActiveGroupCategory(item.value)} className={`mx-3 pl-9 pr-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${activeGroupCategory === item.value ? 'text-[#1683ff] bg-[#e7f3ff]' : 'text-[#5f7892] hover:bg-[#eaf4ff] hover:text-[#1683ff]'}`}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-1">
                  <div onClick={() => setActiveGroupCategory('operation')} className={`mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${activeGroupCategory === 'operation' ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#eaf4ff]'}`}>
                    <Megaphone size={16} className={activeGroupCategory === 'operation' ? 'text-current' : 'text-[#7d96b2]'} />
                    <span className="flex-1">运营群</span>
                  </div>
                </div>

                <div className="mt-1">
                  <div className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors">
                    <Tag size={16} className="text-[#7d96b2]" />
                    <span className="flex-1">群标签</span>
                    <ChevronDown size={14} className="text-[#7d96b2]" />
                  </div>
                </div>

                <div className="mt-1">
                  <div className="mx-3 flex items-center gap-2 rounded-md px-3 py-2.5 text-[#31506f] cursor-pointer hover:bg-[#eaf4ff] transition-colors">
                    <Clock size={16} className="text-[#7d96b2]" />
                    <span className="flex-1">待跟进需求</span>
                    <Settings size={14} className="text-[#7d96b2] hover:text-[#1683ff] cursor-pointer" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Left Panel: Session or Contact List */}
      {activeModule !== 'moments' && !isAutomationPage && (
      <div className={`${activeModule === 'chat' ? 'w-[340px]' : 'w-[320px]'} border-r border-[#dbe8f7] flex flex-col shrink-0 bg-white`}>
        {activeModule === 'chat' ? (
          <>
            <div className="p-4 border-b border-[#dbe8f7] flex flex-col gap-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!isGroupPanelOpen && (
                    <button
                      onClick={() => setIsGroupPanelOpen(true)}
                      className="text-[#7d96b2] hover:text-[#1683ff] transition-colors p-1 -ml-1 rounded hover:bg-[#e7f3ff]"
                      title="展开分组"
                    >
                      <PanelLeftOpen size={18} />
                    </button>
                  )}
                  <span className="font-bold text-base text-[#102a4c]">{sessionPanelTitle}</span>
                </div>
              </div>
              <div className="flex h-9 rounded border border-[#cfd8e3] bg-white focus-within:border-[#1683ff] focus-within:ring-2 focus-within:ring-[#1683ff]/10">
                <div className="relative w-[104px] shrink-0 border-r border-[#dbe8f7]">
                  <button
                    type="button"
                    onClick={() => setIsPrivateSessionFilterOpen(prev => !prev)}
                    className="h-full w-full flex items-center justify-between gap-1 px-3 text-xs text-[#31506f] hover:bg-[#f4f9ff]"
                  >
                    <span className="truncate">{privateSessionFilterOption.label}</span>
                    <ChevronDown size={12} className={`shrink-0 text-[#7d96b2] transition-transform ${isPrivateSessionFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isPrivateSessionFilterOpen && (
                    <div className="absolute left-0 top-full mt-1 w-[132px] rounded-md border border-[#d8e5f4] bg-white shadow-[0_8px_24px_rgba(16,42,76,0.12)] z-30 py-1">
                      {privateSessionFilterOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handlePrivateSessionFilterFieldChange(option.value)}
                          className={`w-full px-3 py-2 text-left text-xs transition-colors ${privateSessionFilterField === option.value ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative flex-1 min-w-0">
                  <textarea
                    rows={1}
                    placeholder={privateSessionFilterOption.placeholder}
                    value={privateSessionFilterKeyword}
                    onChange={(e) => setPrivateSessionFilterKeyword(e.target.value)}
                    className="w-full h-full resize-none overflow-hidden pl-3 pr-9 py-2 bg-transparent border-0 text-xs leading-5 text-[#31506f] placeholder:text-[#9db4ca] focus:outline-none"
                  />
                  <Search size={15} className="absolute right-2.5 top-2.5 text-[#1683ff]" />
                </div>
              </div>
              {privateSessionFilterField === 'id788' && privateSessionDisplayValues.length > 0 && (
                <div className="rounded border border-[#d8e5f4] bg-[#f7fbff] px-2.5 py-2 -mt-1">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-[#7d96b2]">
                    <span>已输入 {privateSessionDisplayValues.length} 个788ID</span>
                    <button
                      onClick={() => setPrivateSessionFilterKeyword('')}
                      className="text-[#1683ff] hover:text-[#0f6fd6]"
                    >
                      清空
                    </button>
                  </div>
                  <div className="max-h-[72px] overflow-y-auto flex flex-wrap gap-1.5 pr-1">
                    {privateSessionDisplayValues.map((id, index) => (
                      <span key={`${id}-${index}`} className="max-w-full inline-flex items-center gap-1 rounded-full border border-[#c9e3ff] bg-white px-2 py-1 text-[11px] text-[#31506f]">
                        <span className="truncate max-w-[180px]">{id}</span>
                        <button
                          onClick={() => removePrivateSessionSearchValue(index)}
                          className="shrink-0 text-[#7d96b2] hover:text-red-500"
                          title="移除"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <button
                    type="button"
                    data-testid="private-city-filter"
                    onClick={() => {
                      setIsPrivateCityFilterOpen(prev => !prev);
                      setIsPrivateCustomerServiceFilterOpen(false);
                      setIsPauseFollowupFilterOpen(false);
                    }}
                    className={`w-full h-9 flex items-center justify-between gap-2 px-2.5 border rounded text-xs transition-colors ${selectedPrivateCity ? 'border-[#9acbff] bg-[#f7fbff] text-[#1683ff]' : 'border-[#cfd8e3] bg-white text-[#9db4ca] hover:border-[#9acbff]'}`}
                  >
                    <span className="flex items-center min-w-0 flex-1">
                      <span data-testid="private-city-filter-label" className="shrink-0 pr-2 mr-2 border-r border-[#dbe8f7] text-[11px] text-[#7d96b2]">城市</span>
                      <span className="truncate">{selectedPrivateCity || '请选择'}</span>
                    </span>
                    <ChevronDown size={12} className={`shrink-0 text-[#7d96b2] transition-transform ${isPrivateCityFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isPrivateCityFilterOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full rounded-md border border-[#d8e5f4] bg-white shadow-[0_8px_24px_rgba(16,42,76,0.14)] z-40 py-1">
                      <button
                        type="button"
                        onClick={() => { setSelectedPrivateCity(''); setIsPrivateCityFilterOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-xs ${!selectedPrivateCity ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'}`}
                      >
                        不限城市
                      </button>
                      {privateCityOptions.map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => { setSelectedPrivateCity(city); setIsPrivateCityFilterOpen(false); }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between ${selectedPrivateCity === city ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'}`}
                        >
                          <span>{city}</span>
                          {selectedPrivateCity === city && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    data-testid="private-customer-service-filter"
                    onClick={() => {
                      setIsPrivateCustomerServiceFilterOpen(prev => !prev);
                      setIsPrivateCityFilterOpen(false);
                      setIsPauseFollowupFilterOpen(false);
                    }}
                    className={`w-full h-9 flex items-center justify-between gap-2 px-2.5 border rounded text-xs transition-colors ${selectedPrivateCustomerService ? 'border-[#9acbff] bg-[#f7fbff] text-[#1683ff]' : 'border-[#cfd8e3] bg-white text-[#9db4ca] hover:border-[#9acbff]'}`}
                  >
                    <span className="flex items-center min-w-0 flex-1">
                      <span data-testid="private-customer-service-filter-label" className="shrink-0 pr-2 mr-2 border-r border-[#dbe8f7] text-[11px] text-[#7d96b2]">客服名称</span>
                      <span className="truncate">{selectedPrivateCustomerService || '请选择'}</span>
                    </span>
                    <ChevronDown size={12} className={`shrink-0 text-[#7d96b2] transition-transform ${isPrivateCustomerServiceFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isPrivateCustomerServiceFilterOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full rounded-md border border-[#d8e5f4] bg-white shadow-[0_8px_24px_rgba(16,42,76,0.14)] z-40 py-1">
                      <button
                        type="button"
                        onClick={() => { setSelectedPrivateCustomerService(''); setIsPrivateCustomerServiceFilterOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-xs ${!selectedPrivateCustomerService ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'}`}
                      >
                        不限客服
                      </button>
                      {privateCustomerServiceOptions.map(customerService => (
                        <button
                          key={customerService}
                          type="button"
                          onClick={() => { setSelectedPrivateCustomerService(customerService); setIsPrivateCustomerServiceFilterOpen(false); }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between ${selectedPrivateCustomerService === customerService ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'}`}
                        >
                          <span>{customerService}</span>
                          {selectedPrivateCustomerService === customerService && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {activeChatFilter === 'all' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPauseFollowupFilterOpen(prev => !prev);
                      setIsPrivateCityFilterOpen(false);
                      setIsPrivateCustomerServiceFilterOpen(false);
                    }}
                    className={`w-full h-9 flex items-center justify-between gap-2 px-3 rounded border text-xs transition-colors ${selectedPauseFollowupTags.length > 0 ? 'border-[#9acbff] bg-[#e7f3ff] text-[#1683ff]' : 'border-[#cfd8e3] bg-white text-[#31506f] hover:border-[#9acbff]'}`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Tag size={14} className="shrink-0" />
                      <span className="truncate">{pauseFollowupFilterLabel}</span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {selectedPauseFollowupTags.length > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-white border border-[#c9e3ff] text-[10px] flex items-center justify-center">
                          {selectedPauseFollowupTags.length}
                        </span>
                      )}
                      <ChevronDown size={12} className={`transition-transform ${isPauseFollowupFilterOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  {isPauseFollowupFilterOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-[#d8e5f4] bg-white shadow-[0_12px_28px_rgba(16,42,76,0.16)] z-40 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#e5eef8] bg-[#f7fbff]">
                        <div>
                          <div className="text-xs font-semibold text-[#31506f]">暂停跟进用户</div>
                          <div className="text-[10px] text-[#7d96b2] mt-0.5">支持选择多个标签</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPauseFollowupTags([])}
                          disabled={selectedPauseFollowupTags.length === 0}
                          className="text-[11px] text-[#1683ff] disabled:text-[#9db4ca] disabled:cursor-not-allowed"
                        >
                          清空
                        </button>
                      </div>
                      <div className="py-1.5 max-h-[244px] overflow-y-auto">
                        {pauseFollowupFilterOptions.map((option, index) => {
                          const selected = selectedPauseFollowupTags.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => togglePauseFollowupTag(option)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${selected ? 'bg-[#e7f3ff] text-[#1683ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'} ${index === 1 ? 'border-b border-[#e5eef8] mb-1.5 pb-2.5' : ''}`}
                            >
                              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-[#1683ff] border-[#1683ff] text-white' : 'bg-white border-[#b9cce0]'}`}>
                                {selected && <Check size={11} strokeWidth={3} />}
                              </span>
                              <span className="flex-1">{option}</span>
                              {option === '无异常' && <span className="text-[10px] text-[#7d96b2]">正常用户</span>}
                              {option === '全部暂停跟进用户' && <span className="text-[10px] text-[#7d96b2]">汇总</span>}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 border-t border-[#e5eef8] bg-[#f7fbff]">
                        <span className="text-[10px] text-[#7d96b2]">具体原因可多选，按任一条件匹配</span>
                        <button
                          type="button"
                          onClick={() => setIsPauseFollowupFilterOpen(false)}
                          className="h-7 px-3 rounded bg-[#1683ff] text-white text-xs hover:bg-[#0f6fd6]"
                        >
                          完成
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between text-xs mt-1">
                <div className="flex gap-2 text-[#5f7892]">
                  <span className="cursor-pointer px-3 py-1 rounded-full bg-[#e7f3ff] text-[#1683ff]">只看我的</span>
                  <span className="cursor-pointer px-3 py-1 rounded-full bg-[#f4f8fc] hover:bg-[#e7f3ff] hover:text-[#1683ff]">未读</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer text-[#31506f] hover:text-[#1683ff]">
                  <Filter size={12} /> 客户消息
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-3">
              {visibleSessionList.length === 0 && (
                <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center px-6">
                  <div className="w-12 h-12 rounded-full bg-[#f4f9ff] text-[#9db4ca] flex items-center justify-center mb-3">
                    <Search size={22} />
                  </div>
                  <div className="text-sm font-medium text-[#31506f]">暂无符合条件的会话</div>
                  <div className="text-xs text-[#9db4ca] mt-1">可调整标签或其他筛选条件后查看</div>
                </div>
              )}
              {visibleSessionList.map((session, i) => (
                <div key={`${session.customer788Id}-${i}`} onClick={() => {
                  const tabId = `chat-${session.customer788Id}`;
                  const matchedTab = tabs.find(tab => tab.id === tabId);
                  if (matchedTab) {
                    setActiveTabId(matchedTab.id);
                  } else {
                    setTabs(prev => [...prev, { id: tabId, title: session.name, type: 'chat' }]);
                    setActiveTabId(tabId);
                  }
                }} className={`flex gap-3 px-3 py-3.5 rounded-lg cursor-pointer transition-colors ${`chat-${session.customer788Id}` === activeTab.id ? 'bg-[#e3f1ff]' : 'hover:bg-[#f4f9ff]'}`}>
                  <div className="relative w-11 h-11 rounded-full bg-[#e7f3ff] shrink-0 overflow-hidden border border-[#d8e5f4]">
                    <img src={`https://picsum.photos/seed/${session.name}/40/40`} alt="avatar" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    {session.unread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ff5b5b] border border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-sm font-semibold text-[#31506f] truncate">{session.name}</span>
                      <span className="text-xs text-[#9db4ca] shrink-0">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[13px] text-[#7d96b2] truncate flex-1 min-w-0">{session.msg}</span>
                      <span className={`h-5 px-1.5 rounded border text-[10px] shrink-0 inline-flex items-center ${getSessionReceptionBadgeClass(session.receptionStatus)}`}>
                        {session.receptionStatus}
                      </span>
                    </div>
                    {(session.abnormalTag || session.isBlacklisted) && (
                      <div className="flex items-center gap-1.5 min-w-0">
                      {session.abnormalTag && (
                          <span className="max-w-[120px] h-5 truncate px-1.5 rounded border border-amber-200 bg-amber-50 text-[10px] text-amber-600 shrink-0 inline-flex items-center" title={getPauseFollowupBadgeText(session.abnormalTag)}>
                            {getPauseFollowupBadgeText(session.abnormalTag)}
                        </span>
                      )}
                      {session.isBlacklisted && (
                        <span className="h-5 px-1.5 rounded border border-red-200 bg-red-50 text-[10px] text-red-600 shrink-0 inline-flex items-center">
                          黑名单
                        </span>
                      )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="p-4 border-b border-[#dbe8f7] flex flex-col gap-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!isGroupPanelOpen && (
                    <button
                      onClick={() => setIsGroupPanelOpen(true)}
                      className="text-[#7d96b2] hover:text-[#1683ff] transition-colors p-1 -ml-1 rounded hover:bg-[#e7f3ff]"
                      title="展开分组"
                    >
                      <PanelLeftOpen size={18} />
                    </button>
                  )}
                  <span className="font-bold text-base text-[#102a4c]">交付群会话</span>
                </div>
                <div className="flex gap-2">
                   <button
                     onClick={openMatchGroupModal}
                     className="h-8 px-2.5 flex items-center gap-1.5 hover:bg-[#e7f3ff] rounded text-[#31506f] hover:text-[#1683ff] text-xs border border-[#d8e5f4]"
                     title="创建交付群"
                   >
                     <Plus size={15} />
                     创建交付群
                   </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索群名称"
                  value={groupSearchKeyword}
                  onChange={(e) => setGroupSearchKeyword(e.target.value)}
                  className="w-full h-9 pl-3 pr-9 bg-white border border-[#cfd8e3] rounded text-xs text-[#31506f] placeholder:text-[#9db4ca] focus:outline-none focus:border-[#1683ff] focus:ring-2 focus:ring-[#1683ff]/10"
                />
                <Search size={15} className="absolute right-2.5 top-2.5 text-[#1683ff]" />
              </div>
              <div className="flex gap-2">
                {['全国', '合肥', '南京'].map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedGroupCity(city)}
                    className={`h-8 flex-1 rounded border text-xs transition-colors ${selectedGroupCity === city ? 'border-[#9acbff] bg-[#e7f3ff] text-[#1683ff]' : 'border-[#cfd8e3] bg-white text-[#31506f] hover:border-[#9acbff]'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative group/dropdown flex-1">
                  <div className="h-8 flex items-center justify-between px-3 bg-white border border-[#cfd8e3] rounded text-xs cursor-pointer text-[#31506f] hover:border-[#9acbff]">
                    <span className={selectedAgent ? '' : 'text-[#9db4ca]'}>{selectedAgent || '分销中介'}</span>
                    <ChevronDown size={12} className="text-[#7d96b2]" />
                  </div>
                  <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#d8e5f4] rounded-md shadow-[0_8px_24px_rgba(16,42,76,0.12)] z-20 hidden group-hover/dropdown:block">
                    <div className="p-2 border-b border-[#edf3fa]">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="搜索姓名"
                          className="w-full h-8 pl-7 pr-2 bg-[#f7fbff] border border-[#d8e5f4] rounded text-xs text-[#31506f] placeholder:text-[#9db4ca] focus:outline-none focus:border-[#1683ff]"
                        />
                        <Search size={12} className="absolute left-2.5 top-2.5 text-[#7d96b2]" />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1">
                      <div
                        onClick={() => setSelectedAgent(null)}
                        className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between ${!selectedAgent ? 'text-[#1683ff] bg-[#e7f3ff]' : 'text-[#31506f] hover:bg-[#f4f9ff]'}`}
                      >
                        <span>全部中介</span>
                        {!selectedAgent && <Check size={12} />}
                      </div>
                      {groupAgentOptions.map(name => (
                        <div
                          key={name}
                          onClick={() => setSelectedAgent(name === selectedAgent ? null : name)}
                          className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between ${
                            name === selectedAgent
                              ? 'text-[#1683ff] bg-[#e7f3ff]'
                              : 'text-[#31506f] hover:bg-[#f4f9ff]'
                          }`}
                        >
                          <span>{name}</span>
                          {name === selectedAgent && <Check size={12} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setGroupListMode(groupListMode === 'unread' ? 'latest' : 'unread')}
                  className={`h-8 px-3 rounded border text-xs transition-colors ${groupListMode === 'unread' ? 'border-[#9acbff] bg-[#e7f3ff] text-[#1683ff]' : 'border-[#cfd8e3] bg-white text-[#31506f] hover:border-[#9acbff]'}`}
                >
                  {groupListMode === 'unread' ? '未读' : '最新消息'}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <div className="text-[#7d96b2]">共 {visibleGroupList.length} 个群</div>
                <div className="flex items-center gap-1 cursor-pointer text-[#31506f] hover:text-[#1683ff]">
                  <Filter size={12} /> 最新消息
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-3">
              {visibleGroupList.map((group, i) => (
                <div
                  key={i}
                  onClick={() => openTab(group.name)}
                  onContextMenu={(e) => handleContextMenu(e, group.name)}
                  className={`flex gap-3 p-3 rounded-md cursor-pointer hover:bg-[#f4f9ff] transition-colors ${group.name === activeTab.title ? 'bg-[#e7f3ff]' : ''}`}
                >
                  <div className="relative w-10 h-10 rounded-full bg-[#e7f3ff] shrink-0 overflow-hidden border border-[#d8e5f4]">
                    <img src={group.avatar} alt="" className="w-full h-full object-cover" />
                    {isGroupUnread(group) && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ff5b5b] border border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#31506f] truncate">{group.name}</span>
                      <span className="text-xs text-[#9db4ca] shrink-0">{group.time}</span>
                    </div>
                    <div className="text-xs text-[#7d96b2] truncate">{group.lastMsg}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#9db4ca]">
                      <span className="px-1.5 py-0.5 rounded bg-[#f4f8fc]">{group.city}</span>
                      <span className="truncate">{group.agent}</span>
                    </div>
                  </div>
                </div>
              ))}
              {visibleGroupList.length === 0 && (
                <div className="h-40 flex flex-col items-center justify-center text-[#9db4ca] text-xs">
                  <Users size={28} strokeWidth={1.5} className="mb-2" />
                  暂无符合条件的交付群
                </div>
              )}
            </div>
          </>
        )}
      </div>
      )}

      {activeModule === 'moments' && !isGroupPanelOpen && (
        <div className="hidden lg:flex w-10 border-r border-[#dbe8f7] bg-[#f3f9ff] shrink-0 items-start justify-center pt-4">
          <button
            onClick={() => setIsGroupPanelOpen(true)}
            className="text-[#7d96b2] hover:text-[#1683ff] hover:bg-[#e7f3ff] transition-colors p-2 rounded-lg"
            title="展开动态筛选"
          >
            <PanelLeftOpen size={18} />
          </button>
        </div>
      )}

      {/* Middle Panel: Tabs and Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 relative">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-2 pt-2 pb-0 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto shrink-0 bg-zinc-50 dark:bg-zinc-900/30">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer whitespace-nowrap border border-b-0 ${
                activeTabId === tab.id
                  ? 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 font-medium z-10 relative top-[1px]'
                  : 'bg-zinc-100 dark:bg-zinc-900 border-transparent text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="truncate max-w-[120px]">{tab.title}</span>
              <X
                size={12}
                className="text-zinc-400 hover:text-red-500 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setTabs(tabs.filter(t => t.id !== tab.id));
                }}
              />
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
           {activeModule === 'moments' && !isAutomationPage ? (
             <MomentsView
               moments={MOCK_MOMENTS}
               accounts={MOCK_ACCOUNTS}
               selectedMomentId={selectedMomentId}
               onSelectMoment={setSelectedMomentId}
               onOpenProfile={() => {}}
               onSendMessage={(target) => {
                const userId = typeof target === 'string' ? target : target.userId;
                 // Open a new tab for the user if it doesn't exist, and switch to it
                 const user = sessionList.find(s => s.customer788Id === userId) || sessionList[0];
                 const tabId = user ? `chat-${user.customer788Id}` : `chat-${userId}`;
                 const existingTab = tabs.find(t => t.id === tabId);
                 if (!existingTab) {
                   setTabs([...tabs, { id: tabId, title: user ? user.name : '新会话', type: 'chat' }]);
                 }
                 setActiveTabId(tabId);
                 setActiveModule('chat');
               }}
               filter={activeMomentFilter}
               tabs={tabs}
               setTabs={setTabs}
               setActiveTabId={setActiveTabId}
               setActiveModule={setActiveModule}
              customerProfiles={chatCustomerProfiles}
             />
           ) : renderContent()}
        </div>
      </div>

      {/* AI Floating Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="打开AI私域助手"
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 z-50 group"
        >
          <div className="absolute -top-10 right-0 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI私域助手
          </div>
          <Bot size={28} />
        </button>
      )}

      {/* Copilot Sidebar */}
      <AnimatePresence>
          <motion.div
            initial={false}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ width: sidebarWidth, maxWidth: '100vw', display: isSidebarOpen ? 'flex' : 'none' }}
            className="fixed right-0 top-0 bottom-0 border-l border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl flex flex-col z-40 shadow-2xl"
          >
            <div
              onMouseDown={handleMouseDown}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-500/50 z-50 transition-colors"
            />
            <Sidebar
              onClose={() => setIsSidebarOpen(false)}
              onOpenTab={openTab}
              onRenameOpenedTab={renameOpenedTab}
              pendingAction={pendingSidebarAction}
              isBlacklistModalOpen={isBlacklistModalOpen}
              setIsBlacklistModalOpen={setIsBlacklistModalOpen}
              blacklistReason={blacklistReason}
              setBlacklistReason={setBlacklistReason}
              isReasonDropdownOpen={isReasonDropdownOpen}
              setIsReasonDropdownOpen={setIsReasonDropdownOpen}
            />
          </motion.div>
      </AnimatePresence>

      {/* Context Menu */}
      {contextMenu.visible && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(prev => ({ ...prev, visible: false }))}
          />
          <div
            className="fixed z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 min-w-[160px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
              onClick={() => {
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
            >
              <span className="w-4 h-4 flex items-center justify-center"><ArrowUp size={14}/></span>
              置顶
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
              onClick={() => {
                if (contextMenuGroup) {
                  setGroupUnreadManually(contextMenuGroup.id, !isGroupUnread(contextMenuGroup));
                }
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
            >
              <span className="w-4 h-4 flex items-center justify-center"><Mail size={14}/></span>
              {contextMenuGroup && isGroupUnread(contextMenuGroup) ? '标为已读' : '标为未读'}
            </button>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1"></div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center gap-2"
              onClick={() => {
                if (contextMenu.groupName) {
                  setIsSidebarOpen(true);
                  setPendingSidebarAction({
                    type: 'append',
                    text: `【${contextMenu.groupName}】`,
                    id: Date.now()
                  });
                }
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
            >
              <span className="w-4 h-4 flex items-center justify-center"><Bot size={14}/></span>
              添加到AI对话
            </button>
          </div>
        </>
      )}

      {miniProgramContextMenu.visible && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMiniProgramContextMenu(prev => ({ ...prev, visible: false }))}
          />
          <div
            className="fixed z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-lg py-2 min-w-[140px]"
            style={{ top: miniProgramContextMenu.y, left: miniProgramContextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3">
              <span className="w-4 h-4 flex items-center justify-center"><MessageSquare size={14}/></span>
              引用
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3">
              <span className="w-4 h-4 flex items-center justify-center"><Share2 size={14}/></span>
              转发
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3">
              <span className="w-4 h-4 flex items-center justify-center"><Plus size={15}/></span>
              添加至素材库
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-3"
              onClick={openMatchGroupModal}
            >
              <span className="w-4 h-4 flex items-center justify-center"><Users size={14}/></span>
              创建撮合群
            </button>
          </div>
        </>
      )}

      {/* --- Modals --- */}
      <AnimatePresence>
        {isDeliveryGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded shadow-xl w-[460px] border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">创建交付群</h3>
                <button onClick={closeDeliveryGroupModal} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <span className="text-red-500 mr-1">*</span>房源编号
                  </label>
                  <input
                    type="text"
                    value={deliveryHouseCode}
                    onChange={(e) => {
                      setDeliveryHouseCode(e.target.value);
                      setDeliveryHouseCodeError('');
                    }}
                    placeholder="请输入房源编号"
                    className={`w-full h-10 px-3 rounded border bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 ${deliveryHouseCodeError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-zinc-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'}`}
                  />
                  {deliveryHouseCodeError && (
                    <div className="mt-1.5 text-xs text-red-500">{deliveryHouseCodeError}</div>
                  )}
                </div>
                <div className="rounded bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-xs leading-5 text-blue-700 dark:text-blue-300">
                  保存后将通知【“新版-合肥朋友圈建群”工作流】，由工作流自动创建交付群。
                </div>
                {deliveryGroupLogs.length > 0 && (
                  <div className="rounded border border-zinc-100 dark:border-zinc-800">
                    <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">最近操作</div>
                    <div className="max-h-[104px] overflow-y-auto">
                      {deliveryGroupLogs.slice(0, 3).map(log => (
                        <div key={log.id} className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 flex items-center justify-between border-b last:border-b-0 border-zinc-100 dark:border-zinc-800">
                          <span className="truncate">房源 {log.houseCode}</span>
                          <span className="shrink-0 text-zinc-400">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
                <button
                  onClick={closeDeliveryGroupModal}
                  className="px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  取消
                </button>
                <button
                  onClick={submitDeliveryGroup}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMatchGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded shadow-xl w-[680px] max-h-[86vh] flex flex-col border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">创建交付群</h3>
                <button onClick={() => setIsMatchGroupModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 flex-1 overflow-y-auto">
                <div className="flex items-start gap-4">
                  <div className="w-[92px] pt-2 text-sm text-zinc-600 dark:text-zinc-400 shrink-0">
                    <span className="text-red-500 mr-1">*</span>分销中介
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        根据房源板块「柏堰湖、高新区」随机推荐30位分销中介，已过滤未关联门店数据
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMatchDistributorGroups(buildRecommendedDistributorGroups(['柏堰湖', '高新区']));
                          setSelectedDistributorId(null);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 shrink-0"
                      >
                        换一批
                      </button>
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden bg-zinc-50/40 dark:bg-zinc-950/30">
                      <div className="max-h-[420px] overflow-y-auto">
                        {matchDistributorGroups.map(group => (
                          <div key={group.store} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
                            <div className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                              <span>{group.store}</span>
                              <span className="text-zinc-400 font-normal">{group.agents.length}人</span>
                            </div>
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                              {group.agents.map(agent => {
                                const selected = selectedDistributorId === agent.id;
                                return (
                                  <label
                                    key={agent.id}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'}`}
                                  >
                                    <input
                                      type="radio"
                                      name="match-distributor"
                                      checked={selected}
                                      onChange={() => setSelectedDistributorId(agent.id)}
                                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 shrink-0"
                                    />
                                    <span className={`text-sm font-medium truncate ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-900 dark:text-zinc-100'}`}>{agent.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
                <button
                  onClick={() => setIsMatchGroupModalOpen(false)}
                  className="px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  取消
                </button>
                <button
                  onClick={() => setIsMatchGroupModalOpen(false)}
                  disabled={!selectedDistributorId}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingGroupId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-[400px] p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <AlertCircle size={20} />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">确认删除自定义分组？</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 pl-13">
                删除后将无法恢复，且全局不可见。请确认是否继续？
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingGroupId(null)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteCustomGroup(deletingGroupId)}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Logic Modal */}
      <AnimatePresence>
        {viewingLogicGroupId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setViewingLogicGroupId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-[480px] overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Eye size={16} className="text-indigo-500" />
                  分组创建逻辑
                </h3>
                <button onClick={() => setViewingLogicGroupId(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                {(() => {
                  const group = customGroups.find(g => g.id === viewingLogicGroupId);
                  if (!group) return null;
                  return (
                    <div className="space-y-5">
                      <div>
                        <div className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">工作流名称</div>
                        <div className="flex flex-wrap gap-2">
                          {group.workflows.map((wf, i) => (
                            <div key={i} className="text-sm font-medium text-zinc-800 dark:text-zinc-200 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700">
                              {wf}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">工作流输出字段 ({group.outputs.length})</div>
                        <div className="flex flex-wrap gap-2">
                          {group.outputs.map((field, i) => (
                            <div key={i} className="text-sm text-indigo-700 dark:text-indigo-300 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800/30">
                              {field}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-end">
                 <button
                  onClick={() => setViewingLogicGroupId(null)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-[560px] max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  {editingGroupId ? <Pencil size={18} className="text-indigo-500" /> : <FolderPlus size={18} className="text-indigo-500" />}
                  {editingGroupId ? '编辑自定义分组' : '新建自定义分组'}
                </h3>
                <button onClick={closeCustomGroupForm} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-visible flex-1 space-y-6">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    <span className="text-red-500 mr-1">*</span>自定义分组名称
                  </label>
                  <input
                    type="text"
                    placeholder="最多输入6个汉字，不可重复"
                    maxLength={6}
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-zinc-400"
                  />
                </div>

                {/* Workflow Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    <span className="text-red-500 mr-1">*</span>选择工作流名称
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={groupForm.workflows[0] || ''}
                      onChange={(e) => setGroupForm({...groupForm, workflows: [e.target.value]})}
                    >
                      <option value="" disabled>请选择工作流</option>
                      {availableWorkflows.map(wf => (
                        <option key={wf} value={wf}>{wf}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Output Fields Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    <span className="text-red-500 mr-1">*</span>选择工作流输出字段 (可多选)
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setIsOutputDropdownOpen(!isOutputDropdownOpen)}
                      className="w-full min-h-[42px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <div className="flex-1 flex flex-wrap gap-1.5 pr-4 py-0.5">
                        {groupForm.outputs.length === 0 ? (
                          <span className="text-zinc-400">请选择输出字段</span>
                        ) : (
                          groupForm.outputs.map(output => (
                            <span key={output} className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-xs">
                              {output}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGroupForm({...groupForm, outputs: groupForm.outputs.filter(o => o !== output)});
                                }}
                                className="hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded-full p-0.5"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown size={16} className={`text-zinc-400 shrink-0 transition-transform ${isOutputDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isOutputDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {availableOutputs.map(output => {
                          const isSelected = groupForm.outputs.includes(output);
                          return (
                            <div
                              key={output}
                              onClick={() => {
                                const newOutputs = isSelected
                                  ? groupForm.outputs.filter(o => o !== output)
                                  : [...groupForm.outputs, output];
                                setGroupForm({...groupForm, outputs: newOutputs});
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'}`}>
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                              <span className={`text-sm ${isSelected ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                {output}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {editingGroupId && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300">
                    保存后将仅重新计算当前分组内已有会话；符合新规则的保留，不符合的移出，不会补入分组外历史会话。
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
                <button
                  onClick={closeCustomGroupForm}
                  className="px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitCustomGroup}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!groupForm.name.trim() || groupForm.workflows.length === 0 || groupForm.outputs.length === 0}
                >
                  {editingGroupId ? '保存修改' : '确认创建'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Blacklist Modal */}
      <AnimatePresence>
        {isBlacklistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-[480px] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                  加入黑名单
                </h3>
                <button onClick={() => setIsBlacklistModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 pb-12 overflow-visible">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    <span className="text-red-500 mr-1">*</span>添加原因：
                  </div>
                  <div className="flex-1 relative">
                    <div
                      onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                      className={`w-full bg-white dark:bg-zinc-800 border ${isReasonDropdownOpen ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-700'} rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 cursor-pointer flex items-center justify-between transition-colors`}
                    >
                      <span className={blacklistReason ? '' : 'text-zinc-400'}>
                        {blacklistReason || '请选择'}
                      </span>
                      <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isReasonDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isReasonDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg z-[60] py-1">
                        {['中介同行', '无购房需求', '频繁转派用户', '同事'].map(reason => (
                          <div
                            key={reason}
                            onClick={() => {
                              setBlacklistReason(reason);
                              setIsReasonDropdownOpen(false);
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer ${blacklistReason === reason ? 'bg-zinc-50 dark:bg-zinc-700/50 text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'}`}
                          >
                            {reason}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsBlacklistModalOpen(false)}
                  className="px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (!blacklistReason) return;
                    updateActiveChatProfile({
                      isBlacklisted: true,
                      blacklistReason,
                      status: '黑名单',
                      subtitle: '黑名单用户',
                      abnormalTag: null
                    });
                    setIsBlacklistModalOpen(false);
                    setBlacklistReason('');
                  }}
                  disabled={!blacklistReason}
                  className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reception Confirm Modal */}
      <AnimatePresence>
        {isReceptionConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-[400px] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="text-orange-500"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                  确认介入会话
                </h3>
                <button onClick={() => setIsReceptionConfirmModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                当前会话正处于「线索承接」状态，确认要介入回复吗？<br/>
                <span className="text-zinc-500 mt-2 block">介入可能导致消息回复错乱，打断当前的沟通节奏。</span>
              </div>

              <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-b-lg">
                <button
                  onClick={() => setIsReceptionConfirmModalOpen(false)}
                  className="px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setIsReceptionConfirmModalOpen(false);
                    updateActiveChatProfile({ hasConfirmedReception: true });
                  }}
                  className="px-4 py-1.5 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded transition-colors shadow-sm"
                >
                  确认介入
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {leadPromptModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-[420px] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className={leadPromptModal.type === 'blacklist' ? 'text-red-500' : 'text-amber-500'} />
                  <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">{leadPromptModal.title}</h3>
                </div>
                <button onClick={() => setLeadPromptModal(prev => ({ ...prev, open: false }))} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-6">{leadPromptModal.desc}</p>
                {leadPromptModal.type === 'abnormal' && leadPromptModal.tag && (
                  <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 text-xs border border-amber-100 dark:border-amber-900/30">
                    异常标签：{leadPromptModal.tag}
                  </div>
                )}
                {leadPromptModal.type === 'blacklist' && activeChatProfile?.blacklistReason && (
                  <div className="mt-3 text-xs text-zinc-500">黑名单原因：{activeChatProfile.blacklistReason}</div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                {leadPromptModal.type === 'abnormal' ? (
                  <>
                    <button
                      onClick={() => setLeadPromptModal(prev => ({ ...prev, open: false }))}
                      className="px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors border border-zinc-200 dark:border-zinc-700"
                    >
                      否
                    </button>
                    <button
                      onClick={() => {
                        if (activeChatProfile) {
                          setGeneratedLead788Ids(prev => prev.includes(activeChatProfile.id788) ? prev : [...prev, activeChatProfile.id788]);
                        }
                        setLeadPromptModal(prev => ({ ...prev, open: false }));
                        setActiveChatFilter('lead_abnormal');
                      }}
                      className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
                    >
                      是
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setLeadPromptModal(prev => ({ ...prev, open: false }))}
                    className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
                  >
                    我知道了
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatMessage({ role, time, name, content, images, isHumanOp }: { role: 'user' | 'ai', time: string, name: string, content: string, images?: string[], isHumanOp?: boolean }) {
  const isAI = role === 'ai';
  return (
    <div className={`flex flex-col gap-1 ${isAI ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        {isAI ? (
          <>
            <span>{time}</span>
            <span>{name}</span>
            {isHumanOp && <span className="bg-orange-500 text-white px-1 rounded text-[10px]">运营</span>}
          </>
        ) : (
          <>
            <User size={12} />
            <span>{time}</span>
          </>
        )}
      </div>
      <div className="flex gap-2 max-w-[70%]">
        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0 mt-1 overflow-hidden">
             <img src="https://picsum.photos/seed/user/32/32" alt="user" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
          </div>
        )}
        <div className={`flex flex-col gap-2 ${isAI ? 'items-end' : 'items-start'}`}>
            {images && images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {images.map((img, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 max-w-[200px]">
                            <img src={img} alt="upload" className="w-full h-auto block" />
                        </div>
                    ))}
                </div>
            )}
            {content && (
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isAI ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-tr-sm' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'}`}>
                  {content}
                </div>
            )}
        </div>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0 mt-1 flex items-center justify-center text-white">
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

function PrivateHouseMiniProgramCard({ onContextMenu }: { onContextMenu: (e: React.MouseEvent) => void }) {
  return (
    <div
      onContextMenu={onContextMenu}
      className="w-[214px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden shadow-sm cursor-default select-none"
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">淘</div>
          <span>365淘房</span>
        </div>
        <div className="text-sm text-zinc-800 dark:text-zinc-100 leading-5 line-clamp-2">
          为您找到一套优质匹配房源~
        </div>
      </div>
      <div className="mx-3 mb-3 rounded-sm overflow-hidden border border-orange-100 bg-[#fff3d7]">
        <div className="h-[92px] relative bg-gradient-to-br from-[#ffe6a8] via-[#ffc86b] to-[#f89b2a]">
          <div className="absolute left-2 top-2 text-[18px] leading-5 font-black text-[#3b250c]">
            蜀山满五年改<br/>善房
          </div>
          <div className="absolute left-2 bottom-2 rounded bg-[#f47f20] text-white text-[10px] leading-4 px-1.5">
            城建琥珀御熙府3室2厅1卫
          </div>
          <div className="absolute right-2 bottom-0 w-14 h-16 rounded-t-full bg-white/50"></div>
        </div>
        <div className="px-2 py-1.5 text-[10px] leading-4 text-zinc-700 bg-white">
          城建琥珀御熙府，3室2厅119.12㎡，满五年。该房源位于蜀山区井岗镇板块
        </div>
      </div>
      <div className="px-3 py-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 flex items-center gap-1">
        <LinkIcon size={13} />
        小程序
      </div>
    </div>
  );
}

// --- src/components/Sidebar.tsx ---

interface SidebarProps {
  onClose: () => void;
  onOpenTab: (tabName: string, displayName?: string) => void;
  onRenameOpenedTab?: (tabName: string, displayName: string) => void;
  pendingAction?: { type: 'append', text: string, id: number } | null;
  isBlacklistModalOpen?: boolean;
  setIsBlacklistModalOpen?: (open: boolean) => void;
  blacklistReason?: string;
  setBlacklistReason?: (reason: string) => void;
  isReasonDropdownOpen?: boolean;
  setIsReasonDropdownOpen?: (open: boolean) => void;
}

interface AssistantHistoryItem {
  id: string;
  title: string;
  date: string;
  sortTime: number;
  crowdPackCount: number;
  groupPackCount: number;
  pushTaskCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

const audienceMetaByName: Record<string, Partial<AudienceResource>> = {
  '合肥100w学区房': {
    type: '湖仓541人群包',
    source: 'AI生成',
    status: '已生成',
    audienceCount: 1285,
    createdAt: '今天 10:42',
    updatedAt: '今天 10:46',
    updatedOrder: 202606261046,
    relatedTaskCount: 1,
    configSnapshot: ['城市：合肥市', '需求：学区房', '预算：100万以内']
  },
  '3.5沉寂用户 (二推)': {
    type: '湖仓541人群包',
    source: '引用已有',
    status: '已生成',
    audienceCount: 55,
    createdAt: '03-12 09:52',
    updatedAt: '03-12 09:52',
    updatedOrder: 202603120952,
    relatedTaskCount: 1,
    configSnapshot: ['客户状态：沉寂用户', '触达轮次：二推', '主题：新房']
  },
  '南京改善高意向人群': {
    type: 'CDP人群包',
    source: 'CDP导入',
    status: '已生成',
    audienceCount: 864,
    createdAt: '03-30 18:20',
    updatedAt: '03-31 08:10',
    updatedOrder: 202603310810,
    relatedTaskCount: 0,
    configSnapshot: ['城市：南京', '意向：改善', '活跃度：近30天']
  }
};

const taskMetaByName: Record<string, Partial<PushTaskResource>> = {
  '每日私聊推送_学区房名单': {
    pushType: '私聊推送',
    status: '已完成',
    relatedAudienceName: '合肥100w学区房',
    estimatedReach: 1285,
    pushTime: '每日 11:30',
    createdAt: '今天 11:24',
    updatedAt: '今天 11:30',
    updatedOrder: 202606261130,
    creator: 'AI助手',
    configSnapshot: ['发送账号：C端客服', '黑名单过滤：未设置', '推送间隔：每天'],
    executionResult: '已排期成功'
  },
  '0331-全群-映象星潮': {
    pushType: '群聊推送',
    status: '已完成',
    relatedAudienceName: '合肥100w学区房群',
    estimatedReach: 3,
    pushTime: '即时推送',
    createdAt: '03-31 08:43',
    updatedAt: '03-31 08:43',
    updatedOrder: 202603310843,
    creator: 'AI助手',
    configSnapshot: ['发送账号：365房博士好好', '发送内容：文本 + 淘房小程序', '推送间隔：0-0'],
    executionResult: '已推送'
  },
  '沉寂用户二推测试': {
    pushType: '私聊推送',
    status: '已失败',
    relatedAudienceName: '3.5沉寂用户 (二推)',
    estimatedReach: 55,
    pushTime: '即时推送',
    createdAt: '03-12 10:43',
    updatedAt: '03-12 10:46',
    updatedOrder: 202603121046,
    creator: 'AI助手',
    configSnapshot: ['发送账号：选房分析师合合', '黑名单过滤：中介同行 / 无购房需求', '推送间隔：10-20'],
    executionResult: '部分账号不可用'
  }
};

const groupMetaByName: Record<string, Partial<GroupResource>> = {
  '合肥100w学区房群': {
    status: '已生成',
    groupCount: 3,
    customerCount: 1001,
    createdAt: '今天 10:48',
    updatedAt: '今天 10:48',
    updatedOrder: 202606261048,
    relatedTaskCount: 1,
    configSnapshot: ['城市：合肥市', '需求：学区房', '预算：100万以内', '群类型：运营群']
  },
  '南京改善高意向群聊包': {
    status: '已生成',
    groupCount: 12,
    customerCount: 386,
    createdAt: '03-31 09:10',
    updatedAt: '03-31 09:10',
    updatedOrder: 202603310910,
    relatedTaskCount: 1,
    configSnapshot: ['城市：南京', '客户意向：改善', '活跃度：近30天', '群类型：交付群']
  }
};

const makeAudienceResource = (item: { id: string; name: string; tabName: string }, patch: Partial<AudienceResource> = {}): AudienceResource => {
  const meta = audienceMetaByName[item.name] || {};
  return {
    id: item.id,
    name: item.name,
    originalName: item.name,
    tabName: item.tabName,
    type: meta.type || 'AI人群包',
    source: meta.source || 'AI生成',
    status: (meta.status as AudienceResourceStatus) || '已生成',
    audienceCount: meta.audienceCount || 0,
    createdAt: meta.createdAt || '刚刚',
    updatedAt: meta.updatedAt || '刚刚',
    updatedOrder: meta.updatedOrder || Date.now(),
    relatedTaskCount: meta.relatedTaskCount || 0,
    configSnapshot: meta.configSnapshot || ['来源：AI会话生成', '状态：待确认'],
    ...patch
  };
};

const makeGroupResource = (item: { id: string; name: string; tabName: string }, patch: Partial<GroupResource> = {}): GroupResource => {
  const meta = groupMetaByName[item.name] || {};
  return {
    id: item.id,
    name: item.name,
    originalName: item.name,
    tabName: item.tabName,
    status: (meta.status as GroupResourceStatus) || '已生成',
    groupCount: meta.groupCount || 0,
    customerCount: meta.customerCount || 0,
    createdAt: meta.createdAt || '刚刚',
    updatedAt: meta.updatedAt || '刚刚',
    updatedOrder: meta.updatedOrder || Date.now(),
    relatedTaskCount: meta.relatedTaskCount || 0,
    configSnapshot: meta.configSnapshot || ['来源：AI会话生成', '群聊包状态：待确认'],
    ...patch
  };
};

const makePushTaskResource = (item: { id: string; name: string; tabName: string }, patch: Partial<PushTaskResource> = {}): PushTaskResource => {
  const meta = taskMetaByName[item.name] || {};
  return {
    id: item.id,
    name: item.name,
    originalName: item.name,
    tabName: item.tabName,
    pushType: meta.pushType || '私聊推送',
    status: (meta.status as PushTaskStatus) || '待执行',
    relatedAudienceName: meta.relatedAudienceName || '未关联',
    estimatedReach: meta.estimatedReach || 0,
    pushTime: meta.pushTime || '待设置',
    createdAt: meta.createdAt || '刚刚',
    updatedAt: meta.updatedAt || '刚刚',
    updatedOrder: meta.updatedOrder || Date.now(),
    creator: meta.creator || 'AI助手',
    configSnapshot: meta.configSnapshot || ['配置来源：AI会话', '推送时间：待设置'],
    executionResult: meta.executionResult || '待执行',
    ...patch
  };
};

const initialAudienceResources: AudienceResource[] = [
  makeAudienceResource({ id: 'i1', name: '合肥100w学区房', tabName: '[人群包]i1' }),
  makeAudienceResource({ id: 'aud-global-2', name: '3.5沉寂用户 (二推)', tabName: '[人群包]aud-global-2' }),
  makeAudienceResource({ id: 'aud-global-3', name: '南京改善高意向人群', tabName: '[人群包]aud-global-3' })
];

const initialGroupResources: GroupResource[] = [
  makeGroupResource({ id: 'i3', name: '合肥100w学区房群', tabName: '[AI] 合肥100w学区房群' }),
  makeGroupResource({ id: 'group-global-2', name: '南京改善高意向群聊包', tabName: '[AI] 合肥100w学区房群' })
];

const initialPushTaskResources: PushTaskResource[] = [
  makePushTaskResource({ id: 'i2', name: '每日私聊推送_学区房名单', tabName: '[AI] 每日私聊推送_学区房名单' }),
  makePushTaskResource({ id: 'i4', name: '0331-全群-映象星潮', tabName: '[AI] 群推送_映象星潮' }),
  makePushTaskResource({ id: 'task-global-3', name: '沉寂用户二推测试', tabName: '[AI] 每日私聊推送_学区房名单' })
];

// 小 B 消息触达框架：仅静态演示，不请求业务接口或发送消息。
const reachStorageKey = 'ai-private-b-reach-demo-20261104';
const reachInitial = { plans: [
  { id:'event', name:'待办提醒', kind:'event', purpose:'在固定业务事件后，提醒仍需处理事项的小 B。', rule:'业务事件 A → 延迟检查 → 待办仍有效 → 固定文案 → 渠道发送', enabled:false, city:'西安', delay:'30', time:'09:00', channels:['App消息流'], title:'服务事项提醒', body:'您有一条待处理的服务事项，请前往有客App查看。', updated:'尚未配置', runs:[] },
  { id:'schedule', name:'定时消息', kind:'schedule', purpose:'按固定周期向符合预置条件的小 B 发送消息。', rule:'每日到时 → 固定条件圈选 → 可达检查 → 固定文案 → 渠道发送', enabled:false, city:'西安', delay:'0', time:'09:00', channels:['App消息流'], title:'平台服务通知', body:'您有一条平台服务通知，请前往有客App查看详情。', updated:'尚未配置', runs:[] }
], audiences:[], tasks:[], flows:{}, logs:[] };
let reachState:any = (()=>{try {const x=JSON.parse(localStorage.getItem(reachStorageKey)||'null');return x?.plans?.length ? x : structuredClone(reachInitial);}catch{return structuredClone(reachInitial);}})();
const reachCommit=()=>{try{localStorage.setItem(reachStorageKey,JSON.stringify(reachState));}catch{} window.dispatchEvent(new Event('b-reach-change'));};
const reachNow=()=>new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});
function useReach(){const [,refresh]=useState(0);useEffect(()=>{const f=()=>refresh(x=>x+1);window.addEventListener('b-reach-change',f);return()=>window.removeEventListener('b-reach-change',f)},[]);return reachState;}
const reachChannels=['App消息流','App Push','B端企微','服务号'];
// 通知类型统一采用MRD第2.1节分类，不另设任务场景分类。
const reachNotificationTypes=['平台类','系统类','业务类','商业类','其他'];
const reachPeople=[
 {id:'DEMO-B-001',name:'张顾问',city:'西安',status:'注册已付费',area:'雁塔区',block:'高新',date:'2026-10-18'},
 {id:'DEMO-B-002',name:'李顾问',city:'西安',status:'注册已付费',area:'未央区',block:'经开',date:'2026-10-22'},
 {id:'DEMO-B-003',name:'王顾问',city:'西安',status:'注册未付费',area:'雁塔区',block:'高新',date:'2026-10-25'},
 {id:'DEMO-B-004',name:'陈顾问',city:'西安',status:'体验客户',area:'碑林区',block:'南门',date:'2026-10-28'},
 {id:'DEMO-B-005',name:'赵顾问',city:'西安',status:'注销经纪人',area:'雁塔区',block:'高新',date:'2026-09-01'},
 {id:'DEMO-B-006',name:'刘顾问',city:'西安',status:'注册已付费',area:'雁塔区',block:'高新',date:'2026-10-30'}
];
function ReachButton({children,onClick,primary=false,disabled=false,...rest}:any){return <button type="button" onClick={onClick} disabled={disabled} className={'reach-btn '+(primary?'primary':'')} {...rest}>{children}</button>}
function ReachField({label,children,hint}:any){const id=React.useId();const control=React.isValidElement(children)?React.cloneElement(children as any,{id,'aria-label':label}):children;return <label className="reach-field" htmlFor={id}><span>{label}</span>{control}{hint&&<small>{hint}</small>}</label>}
function ReachBadge({children,green=false}:any){return <span className={'reach-badge '+(green?'green':'')}>{children}</span>}
function ReachDemoNote(){return <div className="reach-demo"><Bot size={14}/><span>框架原型 · 全部为模拟数据，不发送真实消息</span></div>}
// 渠道标识只负责展示，不改变渠道键或既有能力。
// Keep persisted channel keys stable; use the generic channel name in the interface.
function notificationChannelName(channel:string){return ['有客App站内信','App站内消息','系统通知'].includes(channel)?'站内信':channel}
function NotificationChannel({channel,appName}:{channel:string;appName?:string}){
 const push=channel==='App Push';
 const wecom=['B端企微','企微客服','企微群','企微私聊'].includes(channel);
 const service=['服务号','服务号模板消息通知'].includes(channel);
 const Icon=push?Smartphone:wecom?(channel==='企微群'?Users:MessageCircle):service?Radio:Bell;
 return <span className={'notification-channel '+(push?'push':wecom?'wecom':service?'service':'system')}>
  <span className="notification-channel-icon"><Icon size={14} strokeWidth={1.8}/></span>
  <span>{notificationChannelName(channel)}</span>
  {appName&&<small className="notification-channel-app"><span aria-hidden="true">·</span> {appName}</small>}
 </span>;
}
function ReachChannelPicker({value,onChange,cancelled=false,disabled=false}:any){return <div className="reach-channels">{reachChannels.map(c=><label key={c} className={(cancelled&&c.startsWith('App')?'unavailable':'')}><input type="checkbox" checked={value.includes(c)} disabled={disabled||(cancelled&&c.startsWith('App'))} onChange={()=>onChange(value.includes(c)?value.filter(x=>x!==c):[...value,c])}/><NotificationChannel channel={c}/>{cancelled&&c.startsWith('App')&&<small>注销不可用</small>}</label>)}</div>}
function reachCreateTask(d:any,source='手动触达',planId=''){
 const id='DEMO-T-'+Date.now();
 const t={...structuredClone(d),id,source,planId,created:reachNow(),status:'待执行',results:null};
 reachState.tasks.unshift(t);reachState.logs.unshift({time:reachNow(),action:'创建推送任务',name:d.name});reachCommit();return t;
}
function ReachPreview({title,body,link,channel}:any){return <div className="reach-preview"><div className="reach-kicker"><NotificationChannel channel={channel}/><span>内容预览</span></div><strong>{title||'消息标题'}</strong><p>{body||'消息正文'}</p>{link&&<span className="reach-link">{channel==='服务号'?'查看详情（模板映射待接入）':link}</span>}</div>}

const autoAppChannels=['App Push','站内信'];
const autoSpecs:any[] = [
 {
  "sceneKey": "1",
  "name": "新线索-首次用户",
  "channels": [
   "App Push"
  ],
  "messageCategory": "业务类"
 },
 {
  "sceneKey": "2",
  "name": "历史线索激活",
  "channels": [
   "App Push"
  ],
  "messageCategory": "业务类"
 },
 {
  "sceneKey": "3",
  "name": "客户新消息提醒",
  "channels": [
   "App Push"
  ],
  "messageCategory": "业务类"
 },
 {
  "sceneKey": "6",
  "name": "房源上传完成",
  "channels": [
   "App Push"
  ],
  "messageCategory": "业务类"
 },
 {
  "sceneKey": "7",
  "name": "新客户待回复提醒",
  "channels": [
   "App Push",
   "企微客服"
  ],
  "messageCategory": "业务类"
 },
 {
  "sceneKey": "8",
  "name": "入驻审核通过",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "系统类"
 },
 {
  "sceneKey": "9",
  "name": "入驻审核未通过",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "系统类"
 },
 {
  "sceneKey": "10",
  "name": "资料修改审核通过",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "系统类"
 },
 {
  "sceneKey": "11",
  "name": "资料修改审核未通过",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "系统类"
 },
 {
  "sceneKey": "12",
  "name": "有客币-入驻赠送",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "商业类"
 },
 {
  "sceneKey": "13",
  "name": "有客币-平台赠送",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "商业类"
 },
 {
  "sceneKey": "14",
  "name": "有客币-购买线索扣减",
  "channels": [
   "App站内消息"
  ],
  "messageCategory": "商业类"
 },
 {
  "sceneKey": "23",
  "name": "名下经纪人未及时跟进",
  "channels": [
   "企微客服"
  ],
  "messageCategory": "业务类"
 },
 {
  "sceneKey": "24",
  "name": "超时未跟进提醒",
  "channels": [
   "企微群"
  ],
  "messageCategory": "业务类"
 }
];
// 自动化任务仅注册展示信息及业务启停状态，业务执行由原系统负责。
function autoInit(){
 if(reachState.automationCatalogVersion===5)return;
 const existing=reachState.plans||[];
 const plans=autoSpecs.map((spec:any)=>{
  const id='AUTO-SCENE-'+spec.sceneKey;
  const old=existing.find((plan:any)=>plan.id===id&&plan.city==='西安');
  // 本期演示清单中的 App Push 和站内信均面向有客App。
  const channelApps=Object.fromEntries(spec.channels
   .filter((channel:string)=>autoAppChannels.includes(notificationChannelName(channel)))
   .map((channel:string)=>[channel,'有客App']));
  return {id,moduleId:'message-notification',name:spec.name,channels:[...spec.channels],channelApps,messageCategory:spec.messageCategory,city:'西安',enabled:old?.enabled??true};
 });
 reachState.plans=[...plans,...existing.filter((p:any)=>!plans.some((next:any)=>next.id===p.id&&next.city===p.city))];
 reachState.automationCatalogVersion=5;
 try{localStorage.setItem(reachStorageKey,JSON.stringify(reachState))}catch{}
}
autoInit();
function AutoStatus({value}:any){return <span className={'au-status '+(value==='已开启'||value==='渠道已受理'?'good':value==='发送失败'||value==='有失败'?'bad':value==='已跳过'?'muted':'')}><i/>{value}</span>}
function AutoDialog({title,children,onClose,wide=false}:any){const ref=useRef<any>(null);useEffect(()=>{const last=document.activeElement as HTMLElement;const node=ref.current;node?.focus();return()=>last?.focus()},[]);return createPortal(<div className="au-mask"><div className={'au-dialog '+(wide?'wide':'')} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();onClose()}if(e.key==='Tab'){const all=ref.current.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]');const first=all[0],last=all[all.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}}>{children}</div></div>,document.body)}
// 仅供原型走查：生产身份和当前城市由平台登录态/工作城市提供。
const autoDemoContextKey='ai-private-automation-demo-context';
const bDemoTaskCities=['西安','合肥','南京'];
function autoReadDemoContext(){
 const defaults={role:'member',city:'西安',taskCities:bDemoTaskCities};
 try{
  const value=JSON.parse(localStorage.getItem(autoDemoContextKey)||'null');
  return {
   role:value?.role==='admin'?'admin':defaults.role,
   city:typeof value?.city==='string'&&value.city.trim()?value.city:defaults.city,
   taskCities:Array.isArray(value?.taskCities)?value.taskCities.filter((city:any)=>typeof city==='string'):defaults.taskCities,
  };
 }catch{return defaults}
}
function autoCanSwitch(p:any,ctx:any){return ctx.role==='admin'&&p?.city===ctx.city}

const sentInAppSamples=[
 {id:'demo-inbox-04',city:'西安',title:'本周房源核验提醒',body:'请查看名下待核验房源，并在本周五前确认房源状态。',sentAt:'2026-11-09 10:00',hidden:false},
 {id:'demo-inbox-03',city:'西安',title:'本周房源核验提醒',body:'请查看名下待核验房源，并在本周五前确认房源状态。',sentAt:'2026-11-02 10:00',hidden:false},
 {id:'demo-inbox-02',city:'西安',title:'11月平台服务安排',body:'11月平台服务时间为工作日 09:00–18:00。\n如需协助，请联系城市运营。',sentAt:'2026-11-01 14:30',hidden:true},
 {id:'demo-inbox-01',city:'合肥',title:'经纪人服务提醒',body:'请确认经纪人服务资料是否完整。',sentAt:'2026-11-02 09:00',hidden:false},
];
function SentInAppWorkspace({access,onBack,onAccessChange}:any){
 const data=useReach();
 const [query,setQuery]=useState('');
 const [filter,setFilter]=useState('全部状态');
 const [detailId,setDetailId]=useState('');
 const [pending,setPending]=useState<{id:string;hidden:boolean}|null>(null);
 const [notice,setNotice]=useState<{text:string;error?:boolean}|null>(null);
 const isAdmin=access.role==='admin';
 const records=sentInAppSamples.filter(record=>record.city===access.city)
  .sort((a,b)=>b.sentAt.localeCompare(a.sentAt))
  .map(record=>({...record,hidden:data.inAppVisibility?.[record.id]??record.hidden}));
 const visible=records.filter(record=>record.title.includes(query.trim())&&(filter==='全部状态'||record.hidden===(filter==='已屏蔽')));
 const detail=records.find(record=>record.id===detailId);
 const target=records.find(record=>record.id===pending?.id);
 const applyVisibility=()=>{
  if(!target||!pending)return;
  const current=autoReadDemoContext();
  if(!autoCanSwitch(target,current)){
   onAccessChange(current);
   setNotice({text:'权限或工作城市已变化，操作未生效。',error:true});
   setPending(null);
   return;
  }
  reachState.inAppVisibility={...reachState.inAppVisibility,[target.id]:pending.hidden};
  reachCommit();
  setNotice({text:pending.hidden?'站内信已屏蔽。':'站内信已恢复显示。'});
  setPending(null);
 };
 return <div className="au-page au-lean" data-testid="sent-in-app-workspace"><div className="au-shell">
  <nav className="au-breadcrumb" aria-label="页面路径"><Bot size={14}/><span>AI私域助手</span><ChevronRight size={12}/><button type="button" onClick={onBack}>自动化任务</button><ChevronRight size={12}/><span>已发站内信</span></nav>
  <header className="au-header"><div><h1>已发站内信</h1><div className="au-access-context"><span>有客App</span><i/><span>当前城市 <b>{access.city}</b></span>{!isAdmin&&<><i/><span>仅管理员可调整显示状态</span></>}</div></div></header>
  {notice&&<div className="au-notice" role={notice.error?'alert':'status'}>{notice.error?<AlertCircle size={15}/>:<CheckCircle2 size={15}/>}<span>{notice.text}</span><button aria-label="关闭提示" onClick={()=>setNotice(null)}><X size={15}/></button></div>}
  <section className="au-list-panel">
   <div className="au-toolbar inbox-toolbar"><div className="au-actions">
    <label className="au-search"><Search size={16}/><input placeholder="搜索站内信标题" aria-label="搜索站内信标题" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <select aria-label="显示状态" value={filter} onChange={e=>setFilter(e.target.value)}>{['全部状态','显示中','已屏蔽'].map(value=><option key={value}>{value}</option>)}</select>
   </div></div>
   <div className="au-table-frame"><table className="au-table inbox-table">
    <thead><tr><th>标题</th><th>发送时间</th><th>显示状态</th>{isAdmin&&<th>操作</th>}</tr></thead>
    <tbody>{visible.map(record=><tr key={record.id}>
     <td><button type="button" className="inbox-title" onClick={()=>setDetailId(record.id)}>{record.title}</button></td>
     <td><time dateTime={record.sentAt.replace(' ','T')+'+08:00'}>{record.sentAt}</time></td>
     <td><span className={'au-status '+(record.hidden?'':'good')}><i/>{record.hidden?'已屏蔽':'显示中'}</span></td>
     {isAdmin&&<td><button type="button" className="inbox-action" onClick={()=>setPending({id:record.id,hidden:!record.hidden})}>{record.hidden?'恢复显示':'屏蔽'}</button></td>}
    </tr>)}</tbody>
   </table>{!visible.length&&<div className="au-empty">{records.length?'没有匹配的站内信，请调整搜索或筛选条件。':'当前城市暂无已发站内信。'}</div>}</div>
  </section>
  <footer className="au-prototype-footer"><span>原型演示</span>站内信及显示状态为模拟数据。</footer>
 </div>
 {detail&&<AutoDialog title="站内信内容" onClose={()=>setDetailId('')}>
  <header className="au-dialog-header"><h2>站内信内容</h2></header>
  <div className="au-confirm-body inbox-detail"><strong>{detail.title}</strong><time>{detail.sentAt}</time><p>{detail.body}</p></div>
  <footer className="au-dialog-footer"><ReachButton onClick={()=>setDetailId('')}>关闭</ReachButton></footer>
 </AutoDialog>}
 {pending&&target&&<AutoDialog title={pending.hidden?'屏蔽站内信':'恢复显示站内信'} onClose={()=>setPending(null)}>
  <header className="au-dialog-header"><h2>{pending.hidden?'屏蔽这条站内信？':'恢复显示这条站内信？'}</h2></header>
  <div className="au-confirm-body"><p><strong>{target.title}</strong> · {target.sentAt}</p><p>{pending.hidden?'屏蔽后，本次接收人将在有客App中看不到这条站内信。':'恢复后，本次接收人将在有客App中重新看到这条站内信。'}</p></div>
  <footer className="au-dialog-footer"><ReachButton onClick={()=>setPending(null)}>取消</ReachButton><ReachButton primary onClick={applyVisibility}>{pending.hidden?'确认屏蔽':'确认恢复'}</ReachButton></footer>
 </AutoDialog>}
 </div>;
}

function AutomationWorkspace(){
 const data=useReach();const [access,setAccess]=useState(autoReadDemoContext);const isAdmin=access.role==='admin';
 const plans=data.plans.filter((p:any)=>p.moduleId==='message-notification'&&p.city===access.city);
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('全部'),[notificationType,setNotificationType]=useState('全部通知类型');
 const [notice,setNotice]=useState(''),[stopId,setStopId]=useState('');
 const [showSentInApp,setShowSentInApp]=useState(false);
 const switchContext=(patch:any)=>{const ctx={...access,...patch};localStorage.setItem(autoDemoContextKey,JSON.stringify(ctx));window.dispatchEvent(new Event('b-reach-change'));setAccess(ctx);setStopId('');setNotice('');setQuery('');setFilter('全部');setNotificationType('全部通知类型')};
 const permitted=(p:any)=>{const current=autoReadDemoContext();if(current.city!==access.city||!autoCanSwitch(p,current)){setAccess(current);setStopId('');setNotice('仅管理员可调整当前城市的通知状态，身份或城市已变化，请刷新后重试。');return false}return true};
 const visiblePlans=plans.filter((p:any)=>p.name.includes(query.trim())&&(filter==='全部'||(filter==='已开启')===p.enabled)&&(notificationType==='全部通知类型'||p.messageCategory===notificationType));
 // 本地只模拟业务系统返回生效成功；生产须以实际业务接口结果更新状态。
 const applyState=(p:any,enabled:boolean)=>{reachState.plans=reachState.plans.map((x:any)=>x.id===p.id&&x.city===access.city?{...x,enabled}:x);reachCommit();setStopId('');setNotice(access.city+'的任务已'+(enabled?'开启，业务系统将按原规则处理后续事件。':'关闭，业务系统将停止该规则的后续消息触达。'))};
 const toggle=(p:any)=>{const target=reachState.plans.find((x:any)=>x.id===p.id&&x.city===access.city);if(!target||!permitted(target))return;if(target.enabled){setStopId(target.id);return}applyState(target,true)};
 if(showSentInApp)return <SentInAppWorkspace access={access} onAccessChange={setAccess} onBack={()=>setShowSentInApp(false)}/>;
 return <div className="au-page au-lean" data-testid="automation-workspace"><div className="au-shell">
 <nav className="au-breadcrumb"><Bot size={14}/><span>AI私域助手</span><ChevronRight size={12}/><span>自动化任务</span></nav>
 <header className="au-header"><div><h1>自动化任务</h1><div className="au-access-context"><span>当前城市 <b>{access.city}</b></span><i/><span>{isAdmin?'管理员':'仅管理员可调整状态'}</span></div></div></header>
 {notice&&<div className="au-notice" role="status"><CheckCircle2 size={15}/>{notice}<button aria-label="关闭提示" onClick={()=>setNotice('')}><X size={15}/></button></div>}
 <div className="au-category-bar"><h2 className="au-category-heading" data-testid="automation-category">消息通知</h2><ReachButton onClick={()=>setShowSentInApp(true)}><Mail size={15}/>已发站内信</ReachButton></div>
 <section className="au-list-panel"><div className="au-toolbar"><div className="au-tabs">{['全部','已开启','已关闭'].map(f=><button className={f===filter?'active':''} onClick={()=>setFilter(f)} key={f}>{f}<span>{plans.filter((p:any)=>f==='全部'||(f==='已开启')===p.enabled).length}</span></button>)}</div><div className="au-actions"><select aria-label="通知类型" value={notificationType} onChange={e=>setNotificationType(e.target.value)}>{['全部通知类型',...reachNotificationTypes].map(c=><option key={c}>{c}</option>)}</select><label className="au-search"><Search size={16}/><input placeholder="搜索任务" aria-label="搜索自动化任务" value={query} onChange={e=>setQuery(e.target.value)}/></label></div></div>
 <div className="au-table-frame"><table className="au-table au-plan-table"><thead><tr><th>任务名称</th><th>触达渠道</th><th>通知类型</th><th>状态</th></tr></thead><tbody>{visiblePlans.map((p:any)=><tr key={p.id}><td><span className="au-task-name">{p.name}</span></td><td><div className="au-chips">{p.channels.map((channel:string)=>{
  const appName=autoAppChannels.includes(notificationChannelName(channel))?(p.channelApps?.[channel]||'应用待确认'):undefined;
  return <NotificationChannel key={channel} channel={channel} appName={appName}/>;
 })}</div></td><td>{p.messageCategory}</td><td><div className="au-row-controls">{isAdmin?<><button role="switch" aria-checked={p.enabled} aria-label={`${p.name}开关`} className={'automation-switch '+(p.enabled?'on':'')} onClick={()=>toggle(p)}><span/></button><span>{p.enabled?'已开启':'已关闭'}</span></>:<AutoStatus value={p.enabled?'已开启':'已关闭'}/>}</div></td></tr>)}</tbody></table>{!visiblePlans.length&&<div className="au-empty">{plans.length?'没有匹配任务，请调整搜索或筛选条件。':'当前城市暂无已注册的自动化任务。'}</div>}</div><footer className="au-list-footer">共 {visiblePlans.length} 项任务</footer></section>
 <footer className="au-prototype-footer"><span>原型演示</span>任务、身份、城市及开关均为模拟数据，不影响线上。</footer><details className="au-permission-demo"><summary>原型演示工具</summary><div><label>模拟身份<select aria-label="模拟身份" value={access.role} onChange={e=>switchContext({role:e.target.value})}><option value="member">普通成员</option><option value="admin">管理员</option></select></label><label>模拟当前城市<select aria-label="模拟当前城市" value={access.city} onChange={e=>switchContext({city:e.target.value})}><option>西安</option><option>合肥</option><option>全国</option></select></label><label>模拟任务城市权限<select aria-label="模拟任务城市权限" value={access.taskCities.includes('西安')?(access.taskCities.length===1?'xian':'multi'):'other'} onChange={e=>switchContext({taskCities:e.target.value==='xian'?['西安']:e.target.value==='other'?['合肥']:bDemoTaskCities})}><option value="multi">西安、合肥、南京</option><option value="xian">仅西安</option><option value="other">仅合肥</option></select></label><small>仅用于走查权限与城市范围；生产身份和城市由平台提供。</small></div></details>
 </div>
 {stopId&&<AutoDialog title="关闭自动化任务" onClose={()=>setStopId('')}><header className="au-dialog-header"><h2>关闭这个任务？</h2></header><div className="au-confirm-body"><p><strong>{access.city} · {plans.find((p:any)=>p.id===stopId)?.name}</strong></p><p>关闭后，对应业务系统将停止当前城市该规则的后续消息触达，其他城市和规则不受影响。已到达消息保留，重新开启不补发关闭期间的通知。</p></div><footer className="au-dialog-footer"><ReachButton onClick={()=>setStopId('')}>返回</ReachButton><ReachButton primary onClick={()=>{const p=reachState.plans.find((p:any)=>p.id===stopId&&p.city===access.city);if(!p||!permitted(p))return;applyState(p,false)}}>确认关闭</ReachButton></footer></AutoDialog>}
 </div>
}

// 人群圈选统一入口；小B分支仅模拟运营新报表，不接入C端来源。
const bAudienceSource={audienceType:'b',sourceChain:'operations-b-report-demo'};
function reachAudienceTarget(text:string):'b'|'c'|null{
 const clause=(text.match(/(?:圈选|筛选|找出)([^，。；\n]*)/)?.[1]||text.replace(/^\/人群圈选\s*/,'' )).trim();
 const names=/(?:C\s*端(?:用户|客户)?|小\s*b|经纪人|分销中介|中介|客户|用户)/ig;
 const direct=clause.match(/^(?:(?:西安|合肥|南京|苏州|无锡)(?:市)?的?)?(C\s*端(?:用户|客户)?|小\s*b|经纪人|分销中介|中介|客户|用户)/i);
 const matches=[...clause.matchAll(names)];const target=direct?.[1]||matches.at(-1)?.[0];
 return target?(/小\s*b|经纪人|分销中介|中介/i.test(target)?'b':'c'):null;
}
function reachParse(text:string){
 const statuses=['注册已付费','注册未付费','体验客户','注销经纪人'].filter(s=>text.includes(s)||(s==='注册已付费'&&/已付费/.test(text))||(s==='注册未付费'&&/未付费/.test(text)));
 const ids=(text.match(/DEMO-B-\d+/gi)||[]).join(',');
 const issue=/CDP|cdp|记忆|626|541|活跃|带看|成交|预算|到期|最近|近[一二三四五六七八九十两\d]+|过去|上周|上月|昨天|注册日期|注册时间|付费时间|入驻时间|\d{4}[-年]|南京|合肥|苏州|无锡|芜湖/.test(text)?'本轮只演示经纪人状态、城市、区域、板块、经纪人注册ID。请调整不支持的条件。':'';
 return {...bAudienceSource,city:'西安',statuses:statuses.length?statuses:['注册已付费'],area:['雁塔区','未央区','碑林区'].find(a=>text.includes(a.slice(0,2)))||'全部',block:['高新','经开','南门'].find(a=>text.includes(a))||'全部',ids,issue,cycle:/每天更新|每日更新|每天刷新|每日刷新/.test(text)?'day':'once'};
}
function reachFilter(q:any){if(q.audienceType!=='b'||q.sourceChain!==bAudienceSource.sourceChain)throw new Error('小B查询来源不匹配');let rows=reachPeople.filter(p=>p.city===q.city&&q.statuses.includes(p.status)&&(q.area==='全部'||p.area===q.area)&&(q.block==='全部'||p.block===q.block));if(q.ids.trim()){const ids=q.ids.split(/[\s,，;；]+/).filter(Boolean);rows=rows.filter(p=>ids.includes(p.id));}return rows;}
function reachQueryError(q:any){if(q.audienceType!=='b'||q.sourceChain!==bAudienceSource.sourceChain)return '小B查询来源不匹配，请重新确认圈选条件';if(q.issue)return q.issue;if(q.ids){const unknown=q.ids.split(/[\s,，;；]+/).filter(Boolean).filter(id=>!reachPeople.some(p=>p.id===id));if(unknown.length)return '未匹配经纪人注册ID：'+unknown.join('、');}return '';}
function audienceConditionsText(inclusions:string[],exclusions:string[]=[],options:any={}){
 return ['第一步：条件解析','已完成条件识别，请确认解析条件。','','✅ 纳入条件：',...inclusions.map((v,i)=>`${i+1}. ${v}`),'','🚫 排除条件（排除集合内部按“或”处理）：',...(exclusions.length?exclusions.map((v,i)=>`${i+1}. ${v}`):['本次未指定']),...(options.issue?['','暂不可执行：'+options.issue]:[]),'','请输入“确认”继续流程，或描述需要变更的条件'].join('\n');
}
const audiencePreviewText='第二步：预览数据与更新频率\n请确认预估人数、样本和更新频率。';
function reachConditionsText(d:any,notice:string){const q=d.query;return audienceConditionsText(['目标对象：小B','城市：'+q.city,'经纪人状态：'+q.statuses.join(' 或 '),...(q.area!=='全部'?['区域：'+q.area]:[]),...(q.block!=='全部'?['板块：'+q.block]:[]),...(q.ids?['经纪人注册ID：'+q.ids+'（与其他纳入条件取交集）']:[])],q.exclusions||[],{issue:q.issue||notice});}

// 人群圈选扩展小B与多渠道内容、触达：有限规则的本地演示，真实编排、渠道及推送接口待接入。
const bInAppChannel='有客App站内信';
// Fixed targets for this release; IDs are demo values, not a production API contract.
const bYoukeApp={id:'DEMO-APP-YOUKE',name:'有客App'};
const bServiceAccount={id:'DEMO-OA-365',name:'365淘房服务号'};
const bTouchChannels=['App Push',bInAppChannel,'企微私聊','服务号模板消息通知'];
const bServiceTemplate = {
 id: 'demo-service-progress',
 name: '服务进度提醒',
 fields: ['公司名称', '服务内容', '当前进度', '下一进度'],
};
const bServiceMiniProgram = '365获客宝小程序';
const bNotificationCity='西安';
const bNotificationSiteNotice='通知小B本期仅在西安站开放';
const bWecomChannel='企微私聊-光年本地（西安）';
function bNotificationAccessError(access=autoReadDemoContext()){
 if(access.city!==bNotificationCity)return bNotificationSiteNotice;
 return access.taskCities.includes(bNotificationCity)?'':'当前账号没有西安的任务城市权限';
}
function bNotificationSiteOpen(){return !bNotificationAccessError()}
const bEmptyContent = () => ({
 city: '',
 quietEnabled: true,
 channels: [],
 byChannel: {
  'App Push': {appId:bYoukeApp.id,title:'',body:'',voiceEnabled:false,voiceTemplateId:''},
  '有客App站内信': {appId:bYoukeApp.id,title:'',body:''},
  '企微私聊': {body:'',image:'',cardTitle:'',cardLink:'',cardDescription:'',cardCover:''},
  '服务号模板消息通知': {accountId:bServiceAccount.id,account:bServiceAccount.name,fields:{},miniPath:''},
 },
});
// Demo catalog only. Real speech IDs, supported templates and API field names await integration.
const bVoiceTemplates=[{id:'DEMO-VOICE-001',name:'通用通知',prompt:'您有一条新的业务通知，请及时查看。'},{id:'DEMO-VOICE-002',name:'客户消息',prompt:'您有新的客户消息，请及时回复。'},{id:'DEMO-VOICE-003',name:'待办提醒',prompt:'您有新的业务待办，请及时处理。'}];
function BVoicePreview({value}:any){const template=bVoiceTemplates.find(t=>t.id===value.voiceTemplateId);return <div className="bm-voice-note" data-testid="app-voice-preview"><div><Volume2 size={13}/><span>语音播报</span><strong>{value.voiceEnabled?'已开启 · '+(template?.name||'待选择模板'):'未开启'}</strong></div>{value.voiceEnabled&&template&&<p>{template.prompt}</p>}</div>}
function bContentError(pack:any){
 if(!pack?.channels?.length)return '请至少选择一个需要配置内容的渠道';
 for(const c of pack.channels){
  const v=pack.byChannel[c]||{};
  if(c==='App Push'||c===bInAppChannel){
   const name=notificationChannelName(c);
   if(v.appId!==bYoukeApp.id)return name+'：本期仅支持有客App';
   if(!v.title?.trim()||!v.body?.trim())return name+'：请填写标题和正文';
   if(c==='App Push'&&v.voiceEnabled&&!bVoiceTemplates.some(t=>t.id===v.voiceTemplateId))return 'App Push：请选择有效的语音播报模板';
   if(c===bInAppChannel&&!reachNotificationTypes.includes(pack.category))return '站内信：请选择有效的通知类型';
  }
  if(c==='企微私聊'){
   const fields=[v.cardTitle?.trim(),v.cardLink?.trim(),v.cardDescription?.trim(),v.cardCover];
   if(fields.some(Boolean)){
    if(!fields.every(Boolean))return '企微私聊：请填写链接卡片的标题、跳转地址和描述，并上传封面图';
    if(!/^https:\/\/[^\s]+$/i.test(fields[1])||!URL.canParse(fields[1]))return '企微私聊：链接卡片的跳转地址须为有效的 HTTPS 地址';
   }
   if(!v.body?.trim()&&!v.image&&!fields.every(Boolean))return '企微私聊：请配置至少一项消息内容';
  }
  if(c==='服务号模板消息通知'){
   if(v.accountId!==bServiceAccount.id||v.account!==bServiceAccount.name)return '服务号：本期仅支持365淘房服务号';
   const missing=bServiceTemplate.fields.find(field=>!v.fields?.[field]?.trim());
   if(missing)return '服务号：请填写'+missing;
   const path=v.miniPath?.trim();
   if(path&&!/^\/?[\w-]+(?:\/[\w-]+)*(?:\?[^\s#]*)?$/.test(path))return '服务号：请填写有效的365获客宝小程序路径';
  }
 }
 return '';
}
function bContentItems(pack:any,c:string){
 const v=pack.byChannel[c];
 if(c==='App Push'){
  const template=v.voiceEnabled?bVoiceTemplates.find(t=>t.id===v.voiceTemplateId):null;
  return [{type:'App Push',title:v.title,body:v.body,voiceEnabled:!!v.voiceEnabled,voiceTemplateId:template?.id||'',voiceTemplateName:template?.name||'',voicePrompt:template?.prompt||''}];
 }
 if(c===bInAppChannel)return [{type:bInAppChannel,title:v.title,body:v.body}];
 if(c==='企微私聊'){
  const items = [
   ...(v.body?.trim() ? [{type:'文本',body:v.body}] : []),
   ...(v.image ? [{type:'图片',body:'已选择图片',image:v.image}] : []),
   ...(v.cardLink?.trim() ? [{type:'链接卡片',title:v.cardTitle,body:v.cardDescription,link:v.cardLink.trim(),image:v.cardCover}] : []),
  ];
  return items.map((item, index) => ({...item, delay:index * 2}));
 }
 const miniPath=v.miniPath?.trim();
 return [{
  type:'服务号模板消息',
  title:bServiceTemplate.name,
  body:bServiceTemplate.fields.map(field=>field+'：'+(v.fields?.[field]||'')).join('\n'),
  ...(miniPath ? {miniProgram:bServiceMiniProgram,miniPath} : {}),
 }];
}
function bContentSummary(pack:any,c:string){
 if(!pack?.byChannel?.[c])return '尚未配置';
 return bContentItems(pack,c).map((item:any)=>[
  item.title,item.body,item.link,
  item.miniPath ? item.miniProgram+' · '+item.miniPath : '',
 ].filter(Boolean).join('\n')).join('\n\n');
}
function bScheduleNumber(text:string){if(/^\d+$/.test(text))return Number(text);const chars:any={'零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};if(text.includes('十')){const [a,b]=text.split('十');return (a?chars[a]:1)*10+(b?chars[b]:0)}return chars[text]}
function bParseTouch(text:string,base:any={}){
 const v:any={...base};const channels=bTouchChannels.filter(c=>c==='App Push'?/app[ -]?push|push/i.test(text):c===bInAppChannel?/站内信|站内消息/.test(text):c==='企微私聊'?/企微|私聊/.test(text):/服务号/.test(text));if(channels.length)v.requestedChannels=channels;
 const category=reachNotificationTypes.find(c=>text.includes(c));if(category)v.category=category;
 const clock=text.match(/(\d{1,2}|[零一二两三四五六七八九十]{1,3})[:：点](\d{1,2}|[零一二三四五六七八九十]{1,3})?(?:分)?(半)?/);let hour=clock?bScheduleNumber(clock[1]):-1;let minute=clock?(clock[3]?30:clock[2]?bScheduleNumber(clock[2]):0):-1;if(/下午|晚上/.test(text)&&hour>=0&&hour<12)hour+=12;const time=hour>=0&&hour<24&&minute>=0&&minute<60?String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0'):'';
 const cycle=/每天|每日|每周|每星期|每月|每(?:隔)?\s*\d+\s*(?:分钟|小时|天)|周期/.test(text);
 if(cycle){v.sendMode='周期发送';v.sendTime='';v.repeat=null;v.scheduleIssue='';const scheduleClock=time||(!clock?base.repeat?.clock||'':'');const weekly=text.match(/每(?:周|星期)([一二三四五六日天1-7])/);const monthly=text.match(/每月(\d{1,2}|[一二三四五六七八九十]{1,3})[日号]/);const interval=text.match(/每(?:隔)?\s*(\d+)\s*(分钟|小时|天)/);
  if(/每天|每日/.test(text)&&scheduleClock)v.repeat={kind:'daily',clock:scheduleClock};
  else if(weekly&&scheduleClock&&!/每(?:周|星期)[一二三四五六日天1-7][、和至到]/.test(text))v.repeat={kind:'weekly',day:weekly[1],clock:scheduleClock};
  else if(monthly&&scheduleClock&&bScheduleNumber(monthly[1])>=1&&bScheduleNumber(monthly[1])<=31)v.repeat={kind:'monthly',day:bScheduleNumber(monthly[1]),clock:scheduleClock};
  else if(interval&&Number(interval[1])>0&&(interval[2]!=='天'||time))v.repeat={kind:'interval',every:Number(interval[1]),unit:interval[2],clock:time};
  if(!v.repeat)v.scheduleIssue='请用自然语言补齐有效频率/周期与时刻，例如“每天9点发送”或“每周一10点发送”。';
 }else if(/立即|即时/.test(text)){v.sendMode='立即发送';v.sendTime='';v.repeat=null;v.scheduleIssue=''}
 else if(base.sendMode==='周期发送'&&time&&!/定时|明天|后天|\d{4}[-年]/.test(text)){v.sendMode='周期发送';v.sendTime='';v.repeat=base.repeat?{...base.repeat,clock:time}:null;v.scheduleIssue=v.repeat?'':'请用自然语言补齐周期频率。'}
 else if(/定时|明天|后天|\d{1,2}[:：点]|[一二三四五六七八九十]{1,3}点/.test(text)){v.sendMode='定时发送';v.sendTime='';v.repeat=null;v.scheduleIssue='';if(time){const date=new Date(Date.now()+(/后天/.test(text)?2:/明天/.test(text)?1:0)*86400000);const explicit=text.match(/(\d{4})[-年](\d{1,2})[-月](\d{1,2})日?/);const day=explicit?explicit[1]+'-'+explicit[2].padStart(2,'0')+'-'+explicit[3].padStart(2,'0'):new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);v.sendTime=day+'T'+time}}
 const interval=text.match(/间隔\s*(?:改为|调整为|为)?\s*(\d+)\s*(?:[～~到\-]\s*(\d+))?\s*秒/);if(interval)v.interval=interval[1]+'～'+(interval[2]||interval[1]);return v;
}
function bScheduleLabel(d:any){if(d.sendMode==='周期发送'){const r=d.repeat;if(!r)return '周期发送 · 频率/时刻待补充';const value=r.kind==='daily'?'每天 '+r.clock:r.kind==='weekly'?'每周'+r.day+' '+r.clock:r.kind==='monthly'?'每月'+r.day+'日 '+r.clock:'每'+r.every+r.unit+(r.clock?' '+r.clock:'');return '周期发送 · '+value+'（北京时间）'}return d.sendMode==='定时发送'?'定时发送 · '+(d.sendTime?d.sendTime.replace('T',' ')+'（北京时间）':'时刻待补充'):'立即发送'}
const bQuietHours='22:00 至次日 08:00';
function bDefaults(f:any){const req=f.requirements||{};const channels=[...(f.contentPack?.channels||[])];return {...f,channels,city:f.contentPack?.city||'',category:f.contentPack?.category||req.category||'平台类',sendMode:req.sendMode||'立即发送',sendTime:req.sendTime||'',repeat:req.repeat||null,scheduleIssue:req.scheduleIssue||'',sender:channels.includes('企微私聊')?'B端客服':'',interval:req.interval||'0～0',taskName:f.taskName??'小B通知'}}
// 演示沿用推送系统的城市通道，发送身份固定为B端客服。
function bCityConfigError(d:any){
 const access=autoReadDemoContext();
 const accessError=bNotificationAccessError(access);
 if(accessError)return accessError;
 if(!d.city)return '请选择任务城市';
 if(!access.taskCities.includes(d.city))return '当前账号没有该任务城市的权限';
 return d.city===bNotificationCity?'':'该任务城市暂未开放，仅西安可用';
}
function bSenderLabel(d:any,c:string){return c==='企微私聊'?'西安 B 端客服':c==='服务号模板消息通知'?d.contentPack.byChannel[c].account:bYoukeApp.name}
function bChannelLabel(d:any,c:string){if(c==='企微私聊')return bWecomChannel;return notificationChannelName(c)+' · '+d.city+'（演示）'}
function bBlacklistLabel(c:string){return c==='企微私聊'?'小B适用黑名单规则待接入确认':'本渠道过滤规则待接入确认'}
function bConfigError(d:any){if(!d.audience)return '请先引用或创建人群包';if(!d.audience.count)return '当前人群为0人，不能创建推送任务';if(!d.channels?.length)return '请至少选择一个发送渠道';const cityError=bCityConfigError(d);if(cityError)return cityError;if(d.channels.some((c:string)=>!d.contentPack?.channels.includes(c)))return '所选渠道缺少已确认内容，请先补齐内容';if(d.channels.includes('App Push')&&d.audience.people?.some((p:any)=>p.status==='注销经纪人'))return '当前人群包含注销经纪人，App Push不可用，请调整名单或渠道';if(d.sendMode==='周期发送'&&(!d.repeat||d.scheduleIssue))return d.scheduleIssue||'请用自然语言补齐推送频率/周期。';if(d.sendMode==='定时发送'&&(!d.sendTime||new Date(d.sendTime+'+08:00').getTime()<=Date.now()))return '请用自然语言补齐有效的未来定时时间（北京时间）';return bContentError({city:d.city,channels:d.channels,category:d.category,byChannel:d.contentPack.byChannel})}
function bChannelConfiguration(d:any,c:string){const v=d.contentPack.byChannel[c];const content=bContentItems(d.contentPack,c).map(({voiceTemplateName,voicePrompt,...item}:any)=>item);return {name:d.taskName.trim(),audienceId:d.audience.id,city:d.city,channel:c===bInAppChannel?'应用内发送':c,category:d.category,sendMode:d.sendMode,sendTime:d.sendTime||'',repeat:structuredClone(d.repeat||null),...(d.contentPack.quietEnabled?{quietHours:bQuietHours}:{}),interval:c==='企微私聊'?d.interval:null,sender:bSenderLabel(d,c),channelLabel:bChannelLabel(d,c),content,...(c==='App Push'||c===bInAppChannel?{appId:v.appId}:{}),...(c==='服务号模板消息通知'?{accountId:v.accountId,account:v.account,templateId:bServiceTemplate.id,templateFields:Object.fromEntries(bServiceTemplate.fields.map(field=>[field,v.fields[field]]))}:{})};}
function bCreateSingleTask(d:any,c:string){const key=d.operationKey+'|'+c;const existing=reachState.tasks.find((t:any)=>t.creationKey===key);if(existing)return existing;const items=bContentItems(d.contentPack,c);const sender=bSenderLabel(d,c);const t={id:'DEMO-T-'+Date.now()+'-'+Math.floor(Math.random()*10000),executionSystem:'推送系统',creationKey:key,name:d.taskName.trim(),source:'手动触达',created:reachNow(),status:'待执行',audience:structuredClone(d.audience),channels:[c],city:d.city,category:d.category,sendMode:d.sendMode,sendTime:d.sendTime,repeat:structuredClone(d.repeat||null),scheduleText:bScheduleLabel(d),sender,channelLabel:bChannelLabel(d,c),blacklistText:bBlacklistLabel(c),interval:c==='企微私聊'?d.interval:'不适用',title:items[0]?.title||'',body:items[0]?.body||'',link:items[0]?.link||'',contents:structuredClone(items),pushConfigSnapshot:bChannelConfiguration(d,c),results:null};reachState.tasks.unshift(t);reachState.logs.unshift({time:reachNow(),action:'创建推送任务',name:t.name});return t}
function BAgentPlan({flowId}:any){
 useReach();const f=reachState.flows[flowId];if(!f)return null;
 const rows:any[]=f.goal==='audience'?[{id:'audience',text:f.audience?'人群圈选 · 人群包已创建':'人群圈选 · 确认条件并建包',status:f.audience?'done':f.stage==='query'?'loading':'wait'}]:[];
 if(f.goal==='touch'){
  const done=f.createResults?.filter((r:any)=>r.state==='success').length||0;
  const text=f.stage==='done'?`通知小B · ${done}/${f.channels.length} 个任务创建成功`:f.stage==='creating'?'通知小B · 正在分别创建任务':f.stage==='summary'?'通知小B · 等待核对并确认创建':f.stage==='content'?'通知小B · 等待配置渠道内容':'通知小B · 等待人群就绪';
  rows.push({id:'touch',text,status:f.stage==='done'?'done':f.stage==='creating'?'loading':'wait'});
 }
 return <div className="b-agent-plan" data-testid="b-agent-plan"><TaskPlan tasks={rows}/></div>
}
function BContentDialog({flow,onClose,onSave}:any){
 const {taskCities}=autoReadDemoContext();
 const [pack,setPack]=useState<any>(()=>{
  const draft={...bEmptyContent(),...structuredClone(flow.contentDraft)};
  if(draft.city===bNotificationCity&&taskCities.includes(draft.city))return draft;
  return {...draft,city:taskCities.length===1&&taskCities[0]===bNotificationCity?bNotificationCity:''};
 });
 const [active,setActive]=useState('App Push');const [error,setError]=useState('');const v=pack.byChannel[active];
 const setValue=(patch:any)=>{setPack((p:any)=>({...p,byChannel:{...p.byChannel,[active]:{...p.byChannel[active],...patch}}}));setError('')};
 const selectChannel=(c:string)=>{setPack((p:any)=>({...p,channels:p.channels.includes(c)?p.channels.filter((x:string)=>x!==c):[...p.channels,c],...(c===bInAppChannel&&!p.category?{category:flow.requirements?.category||'平台类'}:{})}));setActive(c);setError('')};
 const closeDraft=()=>onClose(pack);
 const selected=pack.channels.includes(active);
 const readImage=(field:'image'|'cardCover',file?:File)=>{
  if(!file)return;
  if(!file.type.startsWith('image/')){setError('请选择图片文件');return}
  if(file.size>1500000){setError('演示图片请小于1.5MB');return}
  const reader=new FileReader();
  reader.onload=()=>setValue({[field]:reader.result});
  reader.onerror=()=>setError('读取图片失败，请重新选择');
  reader.readAsDataURL(file);
 };
 const cityError=bCityConfigError(pack);
 const quietScopeId=React.useId();

 return <AutoDialog title="多渠道触达配置" onClose={closeDraft} wide><div className="bm-dialog"><header className="bm-dialog-head"><div><h2>多渠道触达配置</h2><p>勾选渠道，点击渠道名称切换编辑。切换时保留已填内容。</p></div><button aria-label="关闭内容配置" onClick={closeDraft}><X size={18}/></button></header><div className="bm-dialog-body"><div className="bm-city-config"><ReachField label="任务城市" hint="本期仅西安可用"><select value={pack.city} onChange={e=>{setPack((prev:any)=>({...prev,city:e.target.value}));setError('')}}><option value="">请选择任务城市</option>{taskCities.map((city:string)=><option key={city} value={city} disabled={city!==bNotificationCity}>{city}{city===bNotificationCity?'':'（暂未开放）'}</option>)}</select></ReachField>
 <div className="bm-quiet-config">
  <span className="bm-quiet-icon" aria-hidden="true"><Moon size={14}/></span>
  <strong className="bm-quiet-label">免打扰</strong>
  <span id={quietScopeId} className="sr-only">所有所选渠道共用</span>
  <span className="bm-quiet-time">{pack.quietEnabled?bQuietHours:'已关闭'}</span>
  <button type="button" role="switch" aria-label="免打扰" aria-describedby={quietScopeId} aria-checked={!!pack.quietEnabled} className="bm-quiet-switch" onClick={()=>setPack((prev:any)=>({...prev,quietEnabled:!prev.quietEnabled}))}><span/></button>
 </div></div><div className="bm-channel-select" role="group" aria-label="选择及编辑渠道">{bTouchChannels.map(c=><div key={c} className={'bm-channel-option'+(active===c?' active':'')}><label><input type="checkbox" aria-label={notificationChannelName(c)} checked={pack.channels.includes(c)} onChange={()=>selectChannel(c)}/></label><button type="button" aria-label={'编辑'+notificationChannelName(c)+'内容'} aria-pressed={active===c} onClick={()=>setActive(c)}><NotificationChannel channel={c}/></button></div>)}</div><div className="bm-content-grid"><section><h3>{active==='服务号模板消息通知'?'模板配置':'消息内容'}</h3>{selected&&active!=='企微私聊'&&<div className="bm-fixed-target" data-testid="channel-fixed-target"><span>{active==='服务号模板消息通知'?'发送服务号':'发送应用'}</span><strong>{active==='服务号模板消息通知'?bServiceAccount.name:bYoukeApp.name}</strong></div>}{!selected?<div className="bm-empty"><p>尚未选择此渠道</p><ReachButton onClick={()=>selectChannel(active)}>配置此渠道</ReachButton></div>:<>
 {active==='App Push'&&<><ReachField label="Push标题"><input value={v.title} onChange={e=>setValue({title:e.target.value})} placeholder="填写通知标题"/></ReachField><ReachField label="Push正文"><textarea value={v.body} onChange={e=>setValue({body:e.target.value})} rows={5} placeholder="填写通知正文"/></ReachField><section className="bm-voice-config"><label className="bm-voice-toggle"><input type="checkbox" aria-label="语音播报" checked={!!v.voiceEnabled} onChange={e=>setValue({voiceEnabled:e.target.checked})}/><span>语音播报</span></label>{v.voiceEnabled&&<><ReachField label="语音播报模板"><select value={v.voiceTemplateId||''} onChange={e=>setValue({voiceTemplateId:e.target.value})}><option value="">请选择播报模板</option>{bVoiceTemplates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></ReachField>{bVoiceTemplates.find(t=>t.id===v.voiceTemplateId)&&<p className="bm-footnote" data-testid="voice-template-prompt">播报提示：{bVoiceTemplates.find(t=>t.id===v.voiceTemplateId)?.prompt}</p>}<p className="bm-footnote">预置播报提示为演示内容，正式模板待接入。</p></>}</section></>}
 {active===bInAppChannel&&<><ReachField label="通知类型"><select value={pack.category||''} onChange={e=>{setPack((p:any)=>({...p,category:e.target.value}));setError('')}}><option value="">请选择通知类型</option>{reachNotificationTypes.map(type=><option key={type}>{type}</option>)}</select></ReachField><p className="bm-type-hint">用于站内信分类，本次所选渠道共用。</p><ReachField label="站内信标题"><input value={v.title} onChange={e=>setValue({title:e.target.value})} placeholder="填写消息标题"/></ReachField><ReachField label="站内信正文"><textarea value={v.body} onChange={e=>setValue({body:e.target.value})} rows={7} placeholder="填写完整通知内容"/></ReachField></>}
 {active==='企微私聊'&&<>
  <div className="bm-fixed-target" data-testid="wecom-sender-route"><span>发送客服</span><strong>西安 B 端客服</strong><span>通道</span><strong>{bWecomChannel}</strong></div>
  <ReachField label="企微消息正文"><textarea value={v.body} onChange={e=>setValue({body:e.target.value})} rows={5} placeholder="填写发送给经纪人的消息"/></ReachField>
  <details className="bm-extra">
   <summary>添加图片</summary>
   <ReachField label="企微图片"><input type="file" accept="image/*" onChange={e=>readImage('image',e.target.files?.[0])}/></ReachField>
   {v.image&&<ReachButton onClick={()=>setValue({image:''})}>移除图片</ReachButton>}
  </details>
  <details className="bm-extra">
   <summary>添加链接卡片</summary>
   <ReachField label="标题"><input value={v.cardTitle} onChange={e=>setValue({cardTitle:e.target.value})}/></ReachField>
   <ReachField label="跳转地址"><input value={v.cardLink} onChange={e=>setValue({cardLink:e.target.value})} placeholder="https://..."/></ReachField>
   <ReachField label="描述"><textarea value={v.cardDescription} onChange={e=>setValue({cardDescription:e.target.value})} rows={3}/></ReachField>
   <ReachField label="卡片封面图"><input type="file" accept="image/*" onChange={e=>readImage('cardCover',e.target.files?.[0])}/></ReachField>
   {v.cardCover&&<small className="bm-footnote">已上传封面图</small>}
   {(v.cardTitle||v.cardLink||v.cardDescription||v.cardCover)&&<ReachButton onClick={()=>setValue({cardTitle:'',cardLink:'',cardDescription:'',cardCover:''})}>移除链接卡片</ReachButton>}
  </details>
 </>}
 {active==='服务号模板消息通知'&&<>
  <div className="bm-fixed-target"><span>模板名称</span><strong>{bServiceTemplate.name}</strong></div>
  <p className="bm-footnote">仅填写服务进度等通知内容，禁止填写营销推广内容。</p>
  {bServiceTemplate.fields.map(field=><ReachField label={field} key={field}><input value={v.fields?.[field]||''} onChange={e=>setValue({fields:{...v.fields,[field]:e.target.value}})} placeholder={'请输入'+field}/></ReachField>)}
  <div className="bm-fixed-target"><span>跳转小程序</span><strong>{bServiceMiniProgram}</strong></div>
  <ReachField label="小程序路径" hint="选填"><input value={v.miniPath} onChange={e=>setValue({miniPath:e.target.value})} placeholder="请输入小程序路径"/></ReachField>
 </>}
 </>}</section></div></div>{error&&<div className="bm-error" role="alert">{error}</div>}<footer className="bm-dialog-footer"><span>已选 {pack.channels.length} 个渠道</span><div><ReachButton onClick={closeDraft}>取消</ReachButton><ReachButton primary onClick={()=>{const e=cityError||bContentError(pack);if(e){setError(e);if(!cityError){const channel=bTouchChannels.find(c=>e.startsWith(c)||c==='服务号模板消息通知'&&e.startsWith('服务号'));if(channel)setActive(channel)}return}onSave(pack)}}>确认配置</ReachButton></div></footer></div></AutoDialog>
}
function BConversationCard({data,onAction,onOpenTask,executionMode}:any){const state=useReach();const live=state.flows[data.flowId];const f=data.confirmed?data.snapshot:live;const [audience,setAudience]=useState('');if(!f)return null;const completed=data.confirmed;const blocked=completed||!executionMode||!bNotificationSiteOpen();const confirmChannels=f.channels;return <div className={'b-conversation-card bm-card'+(data.stage==='summary'?' bm-task-confirm':'')} data-testid={'b-'+data.stage+'-card'}><header><span className="b-card-icon">{data.stage==='summary'?<Send size={16}/>:<Bot size={16}/>}</span><strong>{{dependency:'补齐前置依赖',content:'触达配置',config:'多渠道触达配置',summary:'任务信息确认',result:'任务创建结果'}[data.stage]}</strong>{completed&&<small>已确认</small>}</header>{!executionMode&&!completed&&<p className="bm-footnote">请切换到执行模式继续多渠道触达。</p>}
 {data.stage==='dependency'&&<p>请在执行模式中 @人群包，并输入触达要求；尚无人群包时，请先在圈选模式创建。</p>}
 {data.stage==='content'&&<><p>{completed?f.contentPack.city+' · '+f.contentPack.channels.length+'个渠道配置已确认':'选择任务城市与渠道，填写各渠道内容。'}</p>{completed?<div className="bm-confirmed-channels">{f.contentPack.channels.map((c:string)=><NotificationChannel key={c} channel={c}/>)}</div>:<div className="bm-card-actions"><ReachButton primary disabled={blocked} onClick={()=>onAction('content')}>配置多渠道触达</ReachButton></div>}</>}

 {data.stage==='summary'&&<>
 <label className="bm-task-name">
  <span>任务名称</span>
  {completed?<strong>{f.taskName}</strong>:<>
   <input aria-label="任务名称" aria-invalid={!!validateConfirmCardName(f.taskName||'')} disabled={blocked||f.stage==='creating'} value={f.taskName||''} onChange={e=>onAction('name',e.target.value)}/>
   {validateConfirmCardName(f.taskName||'')&&<small className="bm-name-error" role="alert">{validateConfirmCardName(f.taskName||'')}</small>}
  </>}
 </label>
 <div className="bm-confirm-grid bm-confirm-common">{[['接收对象',f.audience?.name+'（'+f.audience?.count+'人）'],['任务城市',f.city],['推送时间',bScheduleLabel(f)],['免打扰时段',f.contentPack?.quietEnabled?bQuietHours:'未开启'],['通知类型',f.category]].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
 {confirmChannels.map((c:string)=><section className="bm-summary-item" key={c}><div className="bm-confirm-channel"><NotificationChannel channel={c}/></div>

 <div className="bm-confirm-grid">{(c==='企微私聊'?[['发送客服',bSenderLabel(f,c)],['通道',bChannelLabel(f,c)],['推送间隔',f.interval+' 秒'],['黑名单',bBlacklistLabel(c)]]:[[c==='服务号模板消息通知'?'发送服务号':'发送应用',bSenderLabel(f,c)]]).map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
 <div className="bm-confirm-content"><span>发送内容</span><div>{bContentSummary(f.contentPack,c)}</div>{c==='企微私聊'&&bContentItems(f.contentPack,c).map((item:any)=>item.image&&<img key={item.type} src={item.image} alt={item.type==='链接卡片'?'链接卡片封面图':'企微待发送图片'}/>)}{c==='App Push'&&<BVoicePreview value={f.contentPack.byChannel[c]}/>}</div></section>)}
 <div className="bm-card-actions"><ReachButton primary disabled={blocked||f.stage==='creating'||!!f.error||!!validateConfirmCardName(f.taskName||'')} onClick={()=>onAction('create')}>{completed?'已确认执行':f.stage==='creating'?'正在创建…':`确认创建${confirmChannels.length}个任务`}</ReachButton></div>
 {!completed&&<p className="bm-footnote">推送频率、周期、时间和间隔可用自然语言修改。</p>}
 {!completed&&<details className="bm-demo-tools"><summary>原型演示工具</summary><label>模拟创建结果<select aria-label="模拟创建结果" disabled={blocked} value={f.demoResult||'success'} onChange={e=>onAction('demo',e.target.value)}><option value="success">全部创建成功</option><option value="partial">企微创建失败</option><option value="unknown">服务号未返回结果</option><option value="inapp-failed">站内信创建失败</option><option value="inapp-unknown">站内信未返回结果</option></select></label></details>}</>}

 {data.stage==='result'&&<><p>创建成功 {f.createResults?.filter((r:any)=>r.state==='success').length||0} / {f.channels.length}；创建成功不代表发送完成。</p>{f.createResults?.map((r:any)=><div className="bm-result-item" key={r.channel}><NotificationChannel channel={r.channel}/><span className={'bm-result-state '+r.state}>{r.state==='success'?'创建成功':r.state==='failed'?'创建失败':'未返回结果'}</span>{r.taskId?<div className="bm-result-id"><small>推送任务ID</small><button className="bm-task-link" onClick={()=>onOpenTask(state.tasks.find((t:any)=>t.id===r.taskId))}>{r.taskId}<ExternalLink size={12}/></button></div>:<small>{r.reason}</small>}</div>)}</>}
 {f.error&&<p className="bm-inline-error" role="alert">{f.error}</p>}
 </div>}

function PushTaskDetailView({task,children}:any){
 const row=(label:string,value:any,key?:string)=><div key={key||label} className="flex min-w-0"><span className="text-zinc-500 w-24 shrink-0">{label}</span><span className="text-zinc-900 dark:text-zinc-100 min-w-0 break-words whitespace-pre-wrap">{value??'-'}</span></div>;
 const basic=[[task.idLabel||'TASK_ID:',task.id],['推送状态:',task.status],['名称:',task.name],['主题:',task.theme],['推送时间:',task.pushTime],...(task.hideInterval?[]:[['推送间隔:',task.interval]]),[task.channelTitle||'通道:',task.channel],['免打扰时段:',task.quietHours],['优先级:',task.priority],...(task.extraBasic||[])];
 return <div className="w-full h-full bg-white dark:bg-zinc-950 flex flex-col overflow-y-auto" data-testid="shared-push-task-detail">
 <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 p-4 shrink-0"><div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"><Send size={20}/></div><div className="min-w-0"><h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{task.detailTitle||'推送任务详情'}</h2><div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 mt-1"><span className="break-all">{task.idLabel||'TASK_ID:'} {task.id}</span><span>|</span><span>推送状态: {task.status}</span><span>|</span><span>创建人: {task.creator}</span><span>|</span><span>创建时间: {task.created}</span></div></div></div>
 <div className="p-6 space-y-8 max-w-5xl w-full">
 <section data-testid="push-basic-info"><h3 className="text-lg font-bold text-blue-600 mb-4">基本信息</h3><div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12 text-sm">{basic.map(([k,v])=>row(k,v))}</div></section>
 <section data-testid="push-recipients"><h3 className="text-lg font-bold text-blue-600 mb-4">收件人</h3><div className="space-y-4 text-sm">{row(task.recipientMode==='event'?'对象来源:':'人群包类型:',task.audienceType)}<div className="flex flex-wrap items-center gap-x-4 gap-y-3">{row(task.recipientMode==='event'?'接收对象:':'人群包名称:',task.audienceName)}<div className="flex"><span className="text-zinc-500 mr-2">{task.recipientMode==='event'?'对象数:':'人数:'}</span><span className="text-zinc-900 dark:text-zinc-100">{task.audienceCountText||<>{task.audienceCount}{task.recipientMode==='event'?'个':'人'}</>}</span></div><div className="flex"><span className="text-zinc-500 mr-2">更新时间:</span><span className="text-zinc-900 dark:text-zinc-100">{task.audienceUpdated||'-'}</span></div></div>{task.recipientMode==='event'?row('对象规则:',task.recipientRule):<>{row('黑名单:',task.blacklist)}{row('白名单:',task.whitelist)}</>}</div></section>
 <section data-testid="push-senders"><h3 className="text-lg font-bold text-blue-600 mb-4">{task.senderTitle||'发送人'}</h3><div className="text-sm">{row((task.senderTitle||'发送人')+':',task.senders)}</div></section>
 <section data-testid="push-content"><h3 className="text-lg font-bold text-blue-600 mb-4">推送内容</h3><div className="space-y-6 text-sm bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">{(task.contents||[]).map((item:any,i:number)=><React.Fragment key={i}>{i>0&&<div className="h-px bg-zinc-200 dark:bg-zinc-800"/>}<div className="grid grid-cols-[1fr_auto] gap-4"><div className="space-y-2 min-w-0">{row(`信息${i+1}类型:`,notificationChannelName(item.type))}{item.delay!=null&&row(`发送延时:`,item.delay+'秒',`delay-${i}`)}{item.title&&row(`信息${i+1}标题:`,item.title)}{row(`信息${i+1}内容:`,item.body)}{item.type==='链接卡片'&&row('跳转地址:',item.link)}{item.miniPath&&<>{row('跳转小程序:',item.miniProgram)}{row('小程序路径:',item.miniPath)}</>}{item.type==='App Push'&&typeof item.voiceEnabled==='boolean'&&<>{row('语音播报:',item.voiceEnabled?'已开启':'未开启')}{item.voiceEnabled&&<>{row('播报模板:',item.voiceTemplateName||'未提供')}{row('播报提示:',item.voicePrompt||'未提供')}</>}</>}{item.image&&<img className="max-w-[200px] rounded-lg" src={item.image} alt={`信息${i+1}图片`}/>}</div></div></React.Fragment>)}</div></section>
 {children}
 </div></div>
}
function ReachTaskDetail({taskId}:any){
 const data=useReach();const t=data.tasks.find(x=>x.id===taskId);if(!t)return <div className="p-6 text-sm text-zinc-500">未找到该演示任务</div>;
 if(t.pushBinding||t.source==='SOP')return <div className="p-6 text-sm text-zinc-500">当前任务不可用，请返回任务列表。</div>;
 const simulate=()=>{const results=t.channels.map((channel,ci)=>({channel,rows:t.audience.people.map((p,i)=>({id:p.id,name:p.name,result:p.status==='注销经纪人'&&channel.startsWith('App')?'已跳过':ci===1&&i===1?'发送失败':'渠道已受理',reason:p.status==='注销经纪人'&&channel.startsWith('App')?'注销账号不支持App渠道':ci===1&&i===1?'模拟渠道暂不可用':'等待实际送达回执'}))}));reachState.tasks=reachState.tasks.map(x=>x.id===taskId?{...x,status:'已完成',results}:x);reachCommit()};
 const contents=t.contents?t.contents.map((item:any,i:number)=>({...item,delay:i*2,body:item.body+(item.link?'\n'+item.link:'')})):[{type:'文本',title:t.title,body:t.body,delay:0},...(t.link?[{type:'链接',body:t.link,delay:0}]:[])];
 const singleChannel=t.contents&&t.channels.length===1?t.channels[0]:null;
 const senderTitle=singleChannel==='企微私聊'?'发送客服':singleChannel==='服务号模板消息通知'?'发送服务号':singleChannel==='App Push'||singleChannel===bInAppChannel?'发送应用':undefined;
 const view={senderTitle,channelTitle:singleChannel&&singleChannel!=='企微私聊'?'渠道:':undefined,hideInterval:!!singleChannel&&singleChannel!=='企微私聊',detailTitle:t.channels.includes(bInAppChannel)?'站内信任务详情':undefined,idLabel:t.contents?'推送任务ID:':undefined,recipientMode:'audience',id:t.id,name:t.name,status:t.status,creator:'当前运营（演示）',created:t.created,theme:'-',pushTime:t.repeat||t.sendMode==='周期发送'?bScheduleLabel(t):t.sendMode==='定时发送'?'定时推送 '+t.sendTime.replace('T',' '):t.sendMode==='立即发送'?'即时推送':t.sendTime||'未提供',interval:t.interval||'按渠道规则，待确认',channel:singleChannel&&singleChannel!=='企微私聊'?notificationChannelName(singleChannel):(t.channelLabel||t.channels.join('、')).replaceAll('有客App站内信','站内信'),quietHours:t.pushConfigSnapshot?t.pushConfigSnapshot.quietHours||'未开启':'待确认',priority:'待确认',extraBasic:[['通知类型:',t.category||'-'],['来源:','手动触达']],audienceType:'AI人群包',audienceName:t.audience.name,audienceCount:t.audience.count,audienceUpdated:t.audience.created||t.created,blacklist:t.blacklistText||'小B适用规则待接入确认',whitelist:'-',senders:senderTitle?t.sender:t.contents?notificationChannelName(t.channels[0])+'：'+t.sender:t.channels.map(c=>notificationChannelName(c)+'：'+(c==='B端企微'?(t.sender||'B端客服')+'（演示）':c==='服务号'?'有客服务号（演示）':'AI有客App（演示）')).join(' | '),contents};
 return <PushTaskDetailView task={view}>
 <section><h3 className="text-lg font-bold text-blue-600 mb-4">发送结果</h3>{!t.results?<p className="text-sm text-zinc-500">{t.status==='已取消'?'任务已停止，尚未发送。':'尚无发送回执，创建任务不代表发送成功。'}</p>:<div className="space-y-4 text-sm">{t.results.map(r=><details key={r.channel} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"><summary className="cursor-pointer text-zinc-700 dark:text-zinc-200">{r.channel} · 受理 {r.rows.filter(x=>x.result==='渠道已受理').length} · 失败 {r.rows.filter(x=>x.result==='发送失败').length} · 跳过 {r.rows.filter(x=>x.result==='已跳过').length}</summary><div className="overflow-x-auto mt-4"><table className="w-full text-left text-xs min-w-[400px]"><thead><tr className="text-zinc-500 border-b"><th className="py-2 font-normal">经纪人 / 注册ID</th><th className="font-normal">发送结果</th><th className="font-normal">原因 / 回执</th><th className="font-normal">已读</th></tr></thead><tbody>{r.rows.map(x=><tr key={x.id} className="border-b border-zinc-100 dark:border-zinc-800"><td className="py-3">{x.name}<small className="block text-zinc-400">{x.id}</small></td><td>{x.result}</td><td>{x.reason}</td><td>未知</td></tr>)}</tbody></table></div></details>)}<p className="text-xs text-zinc-400">执行结束可包含失败或跳过，渠道受理不等于送达或已读。</p></div>}</section>
 <details className="text-sm text-zinc-500"><summary className="cursor-pointer">操作记录</summary><div className="space-y-2 mt-3"><p>当前运营 · {t.created} · 创建任务</p>{t.status==='已完成'&&<p>演示操作 · 模拟执行完成</p>}{t.status==='已取消'&&<p>演示操作 · 停止未发送部分</p>}</div></details>
 <div className="reach-demo-tools"><span>原型演示</span><ReachButton disabled={t.status!=='待执行'} onClick={simulate}>模拟执行与回执</ReachButton>{t.status==='待执行'&&<ReachButton onClick={()=>{reachState.tasks=reachState.tasks.map(x=>x.id===t.id?{...x,status:'已取消'}:x);reachCommit()}}>停止未发送部分</ReachButton>}<small>模拟数据，不发送真实消息。已发送的站内信由站内信列表管理。</small></div>
 </PushTaskDetailView>
}

// One package/detail presentation; target-specific adapters preserve the actual identity and data source.
function canonicalAudienceRoute(route:string){return route==='[AI] 合肥100w学区房'?'[人群包]i1':route.replace(/^\[小B人群\]/,'[人群包]')}
// Simulated values for optional header information; not a production report contract.
const bMemberInfoDemo:any={'DEMO-B-001':{role:'经纪人（示例）',roleId:'DEMO-BR-001',payment:'已付费',mainTrade:'二手房',secondaryTrades:['新房分销','商业','法拍'],priceBudgets:['150万-300万','300万-500万'],mainDistricts:['西咸新区（西安）','雁塔区','长安区','高陵区','鄠邑区','新城区','碑林区','未央区'],mainBlocks:['曲江','长安','城南','紫薇田园都市','高新三期']},'DEMO-B-002':{role:'经纪人（示例）',roleId:'DEMO-BR-002',payment:'已付费'},'DEMO-B-003':{role:'经纪人（示例）',roleId:'DEMO-BR-003',payment:'未付费'},'DEMO-B-004':{role:'经纪人（示例）',roleId:'DEMO-BR-004',payment:'体验中'},'DEMO-B-005':{role:'经纪人（示例）',roleId:'DEMO-BR-005',payment:''},'DEMO-B-006':{role:'经纪人（示例）',roleId:'DEMO-BR-006',payment:'已付费'}};
function audienceMember(name:string,person?:any){return person?{id:person.id,name:person.name,profile:[],source:'operations',bInfo:bMemberInfoDemo[person.id]||null}:{id:audiencePreviewData[name]?.id||'',name,profile:audiencePreviewData[name]?.profile||[],source:'customer'};}
function AudienceMemberDrawer({members,memberId,onClose}:any){
 const [index,setIndex]=useState(()=>Math.max(0,members.findIndex((m:any)=>(m.id||m.name)===memberId)));const [tab,setTab]=useState('记忆');const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{const handle=(e:KeyboardEvent)=>{if(e.key==='Escape')closeRef.current()};window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle)},[]);
 const member=members[index];if(!member)return null;const tabs=['记忆','档案','行为'];const bFields=member.bInfo?[['小B角色',member.bInfo.role],['小B角色ID',member.bInfo.roleId],['付费情况',member.bInfo.payment]].filter(([,value])=>!!value):[];const brokerFields:any[]=member.bInfo?[['主营交易类型',member.bInfo.mainTrade],['副营交易类型',member.bInfo.secondaryTrades],['价格预算',member.bInfo.priceBudgets],['主营区属',member.bInfo.mainDistricts,true],['主营板块',member.bInfo.mainBlocks,true]].filter(([,value])=>Array.isArray(value)?value.length>0:!!value):[];
 return <div className="absolute inset-0 z-[80] flex justify-end" data-testid="audience-member-overlay"><button className="absolute inset-0 bg-black/40" aria-label="关闭用户详情遮罩" onClick={onClose}/><aside role="dialog" aria-modal="true" aria-label="用户详情" className="relative w-full max-w-[380px] h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col">
 <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2"><h3 className="font-medium text-zinc-900 dark:text-zinc-100">用户详情</h3><div className="flex items-center gap-1"><button title="上一位用户" aria-label="上一位用户" disabled={index===0} onClick={()=>setIndex(i=>i-1)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronLeft size={16}/></button><span className="text-xs text-zinc-500">{index+1} / {members.length}</span><button title="下一位用户" aria-label="下一位用户" disabled={index===members.length-1} onClick={()=>setIndex(i=>i+1)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronRight size={16}/></button><button aria-label="关闭用户详情" onClick={onClose} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><X size={16}/></button></div></div>
 <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-300">{member.name.slice(0,1)}</div><div className="min-w-0"><div className="font-bold text-lg text-zinc-900 dark:text-zinc-100 break-words">{member.name}</div><div className="text-xs text-zinc-500 break-all">用户ID：{member.id||'—'}</div></div></div>
 {(bFields.length>0||brokerFields.length>0)&&<section data-testid="audience-b-info" aria-label="B端信息" className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-3"><dl className="grid grid-cols-2 gap-3">{bFields.map(([label,value])=><div key={label} className="min-w-0"><dt className="text-xs text-zinc-500">{label}</dt><dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1 break-words">{value}</dd></div>)}</dl>{brokerFields.length>0&&<dl data-testid="broker-business-fields" className="mt-3 border-t border-zinc-200 dark:border-zinc-700">{brokerFields.map(([label,value,tags])=><div key={label} className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3 py-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0"><dt className="text-xs text-zinc-500">{label}</dt><dd className="min-w-0 text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">{tags?<div className="flex flex-wrap justify-end gap-1.5">{value.map((v:string)=><span key={v} className="inline-block rounded-lg bg-zinc-100 dark:bg-zinc-700 px-2 py-1 text-xs break-words max-w-full">{v}</span>)}</div>:<span className="break-words">{Array.isArray(value)?value.join('、'):value}</span>}</dd></div>)}</dl>}<p className="mt-3 text-[11px] text-zinc-400">示例数据 · 字段来源与口径待接入</p></section>}
 <div role="tablist" aria-label="用户信息" className="flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg">{tabs.map(t=><button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tab===t?'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm':'text-zinc-500 dark:text-zinc-400'}`}>{t}</button>)}</div>
 <div role="tabpanel">{tab==='记忆'&&(member.source==='customer'?<AudiencePreviewMemoryPanel userName={member.name}/>:<div className="py-10 text-center text-sm text-zinc-500">暂无可展示的用户记忆</div>)}{tab==='档案'&&<div className="flex flex-col">{member.profile.length?member.profile.map(([label,value]:any)=><div key={label} className="flex flex-col py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"><div className="text-sm text-zinc-500">{label}</div><div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1 break-words">{value||'—'}</div></div>):<div className="py-10 text-center text-sm text-zinc-500">暂无可展示的用户档案</div>}</div>}{tab==='行为'&&(member.source==='customer'?<AudiencePreviewBehaviorPanel userName={member.name}/>:<div className="py-10 text-center text-sm text-zinc-500">暂无可展示的用户行为</div>)}</div></div></aside></div>;
}
function AudiencePackageDetail({audienceId,displayName}:any){
 const state=useReach();const [memberId,setMemberId]=useState<string|null>(null);const stored=audienceId?state.audiences.find((a:any)=>a.id===audienceId):null;const resource=initialAudienceResources.find(a=>a.id===audienceId)||(!audienceId?initialAudienceResources[0]:null);
 if(!stored&&!resource)return <div className="p-6 text-sm text-zinc-500">未找到该人群包</div>;
 const q=stored?.query;const members=stored?stored.people.map((p:any)=>audienceMember(p.name,p)):['橙子','家和万事兴','贝壳张建','桃燃','用户7892'].map(name=>audienceMember(name));const conditions=stored?['城市：'+q.city,'经纪人状态：'+q.statuses.join(' 或 '),...(q.area!=='全部'?['区域：'+q.area]:[]),...(q.block!=='全部'?['板块：'+q.block]:[]),...(q.ids?['注册ID：'+q.ids]:[]),...(q.start||q.end?['注册日期：'+(q.start||'不限')+' 至 '+(q.end||'不限')]:[])].join(' / '):resource.configSnapshot.join(' / ');
 const name=displayName||stored?.name||resource.name;const count=stored?.count??resource.audienceCount;const cycle=stored?.cycle==='day'?'每日更新':stored?.cycle==='hour'?'每小时更新':'一次性';
 return <div className="w-full h-full bg-white dark:bg-zinc-950 flex flex-col relative overflow-hidden" data-testid="audience-package-detail"><div className="flex items-start gap-3 border-b border-zinc-200 dark:border-zinc-800 p-4 shrink-0"><div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0"><Users size={20}/></div><div className="min-w-0"><h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 break-words">{name}</h2><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 mt-1"><span>预估人数: {count.toLocaleString()} 人</span><span>圈选条件: {conditions}</span><span>更新周期: {cycle}</span><span>创建人: {stored?'当前运营（演示）':'张三'}</span><span>创建时间: {stored?.created||resource.createdAt}</span></div></div></div>
 <div className="flex-1 overflow-auto p-4"><div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800"><tr><th className="px-4 py-3 font-medium">用户昵称</th><th className="px-4 py-3 font-medium">用户ID</th><th className="px-4 py-3 font-medium">操作</th></tr></thead><tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">{members.map((member:any)=><tr key={member.id||member.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/20"><td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{member.name}</td><td className="px-4 py-3 text-zinc-500 font-mono">{member.id||'—'}</td><td className="px-4 py-3"><button className="text-indigo-600 dark:text-indigo-400 hover:underline" onClick={()=>setMemberId(member.id||member.name)}>用户详情</button></td></tr>)}</tbody></table>{!members.length&&<div className="p-10 text-center text-sm text-zinc-500">暂无用户</div>}</div></div>
 {memberId!==null&&<AudienceMemberDrawer key={memberId} members={members} memberId={memberId} onClose={()=>setMemberId(null)}/>}</div>;
}

function Sidebar({ onClose, onOpenTab, onRenameOpenedTab, pendingAction, isBlacklistModalOpen, setIsBlacklistModalOpen, blacklistReason, setBlacklistReason, isReasonDropdownOpen, setIsReasonDropdownOpen }: SidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [resourceView, setResourceView] = useState<AssistantResourceView>('chat');
  const [resourceSearch, setResourceSearch] = useState('');
  useReach();
  const openReachTask = (t:any) => {onOpenTab('[小B任务]'+t.id,t.name);onClose();};
  const [audienceMemberPreview,setAudienceMemberPreview]=useState<any>(null);
  const [bModal,setBModal]=useState<any>(null);
  const notifyBAvailable=bNotificationSiteOpen();
  const bConfigPending=notifyBAvailable&&messages.some(m=>m.card?.type==='b_step'&&m.card.stage==='content'&&!m.card.confirmed&&!m.card.invalidated&&reachState.flows[m.card.flowId]?.stage==='content');
  const bTargetRequest=useRef<string|null>(null);
  const bInputAudienceIds=useRef<string[]>([]);
  const bSetDraft=(flowId:string,patch:any)=>{reachState.flows[flowId]={...reachState.flows[flowId],...patch};reachCommit();return reachState.flows[flowId]};
  const bMessage=(flowId:string,stage:string,content:string)=>{const d=reachState.flows[flowId];if(stage==='conditions'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:reachConditionsText(d,content),bFlowId:flowId,bStage:'conditions'}]);return;}setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content,bFlowId:flowId,card:{type:'b_step',flowId,stage,snapshot:structuredClone(d)} as any}]);};
  const bConfirmMessage=(msg:any,patch:any={})=>setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,...patch,confirmed:true} as any}:m));
  const bConfirmStage=(id:string,stage:string)=>setMessages(prev=>prev.map(m=>m.card?.flowId===id&&m.card.stage===stage&&!m.card.confirmed?{...m,card:{...m.card,confirmed:true,snapshot:structuredClone(reachState.flows[id])} as any}:m));
  const bInvalidate=(flowId:string)=>setMessages(prev=>prev.map(m=>(m.card?.bFlowId===flowId||m.card?.flowId===flowId)&&!m.card?.confirmed?{...m,card:{...m.card,invalidated:true,confirmed:true} as any}:m));
  const bCancelPending=()=>{
    for(const f of Object.values(reachState.flows) as any[]){if(!['done','result','creating','cancelled'].includes(f.stage)){f.stage='cancelled';bInvalidate(f.id)}}
    setBModal(null);bTargetRequest.current=null;reachCommit();
  };
  const bMakeSummary=(id:string)=>{
    const base=bDefaults(reachState.flows[id]);
    const d=bSetDraft(id,{...base,configured:true,stage:'summary',error:bConfigError(base)});
    bMessage(id,'summary',`请核对${d.channels.length}个渠道的触达配置；仅任务名称可手动修改。`);
  };
  const bAdvance=(id:string)=>{const f=reachState.flows[id];if(f.goal==='audience'){bSetDraft(id,{stage:'audience_done'});return}if(!f.audience||!f.audience.count){bSetDraft(id,{stage:'dependency'});bMessage(id,'dependency','请在执行模式中 @人群包，并输入触达要求。');return}if(!f.contentPack){bSetDraft(id,{stage:'content'});bMessage(id,'content','');return}bMakeSummary(id)};
  const beginBReach=(text:string,audience?:any,goal:'audience'|'touch'='audience')=>{
    // 圈选与触达分别发起；触达只能使用本条指令中明确引用的人群包。
    if(goal==='touch'&&(!audience||!audience.count)){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请在执行模式中 @人群包，并输入触达要求；尚无人群包时，请先在圈选模式创建。'}]);return}
    bCancelPending();
    const id='b-chat-'+crypto.randomUUID();
    const selectedAudience=goal==='touch'?audience:null;
    const query=selectedAudience?{...selectedAudience.query,...bAudienceSource}:reachParse(text);
    const needsQuery=goal==='audience';
    reachState.flows[id]={id,intent:text,requirements:goal==='touch'?bParseTouch(text):{},query,goal,stage:needsQuery?'conditions':'start',audience:selectedAudience,contentPack:null,contentDraft:bEmptyContent(),configured:false,rows:selectedAudience?.people||[],createResults:[],demoResult:'success'};
    reachCommit();setResourceView('chat');
    setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',bPlanFlowId:id} as any]);
    if(needsQuery)bMessage(id,'conditions','');else bAdvance(id)
  };
  const bQuery=(id:string)=>{if(mode!=='圈选模式'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请切换到圈选模式，确认圈选条件。'}]);return}const current=reachState.flows[id];const error=reachQueryError(current.query);if(error){bMessage(id,'conditions',error);return}bSetDraft(id,{stage:'query'});setInputLocked(true);setTimeout(()=>{const d=reachState.flows[id];if(d.stage!=='query')return;const rows=reachFilter(d.query);bSetDraft(id,{rows,stage:'preview'});setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:audiencePreviewText+(rows.length?'':'\n\n查询成功，暂无匹配小B。可修改条件后重新确认。'),bFlowId:id,card:{type:'audience',name:d.query.city+(d.query.statuses.length===1?d.query.statuses[0].replace('注册',''):'')+'小B',count:rows.length,updateCycle:d.query.cycle||'once',samples:rows.slice(0,3).map(p=>p.name),audienceType:'b',bFlowId:id} as any}]);setInputLocked(false)},350)};
  const bPackCreated=(msg:any,name:string)=>{if(mode!=='圈选模式'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请先在圈选模式确认创建人群包，再切换执行模式进行触达。'}]);return}const id=msg.card.bFlowId,d=reachState.flows[id];if(msg.card.confirmed||d.stage!=='preview'||!d.rows.length)return;const a={...bAudienceSource,id:'DEMO-A-'+Date.now(),name,count:d.rows.length,people:d.rows,query:structuredClone(d.query),cycle:d.query.cycle||'once',created:reachNow()};reachState.audiences.unshift(a);bSetDraft(id,{audience:a});bConfirmMessage(msg,{name});setBubbles(prev=>[...prev,{id:a.id,type:'audience',text:'人群包(1)',items:[{id:a.id,name,tabName:'[人群包]'+a.id}]}]);setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:`人群包创建完成。`,bFlowId:id,actionButton:{label:'查看人群包详情',tabName:'[人群包]'+a.id}}]);bSetDraft(id,{goal:'audience',requirements:{},stage:'audience_done'})};
  const confirmAudience = (msg:any, name:string = msg.card.name) => {
    if(msg.card?.type!=='audience'||msg.card.invalidated||msg.card.confirmed)return;
    const error=validateConfirmCardName(name);
    if(error){setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,nameError:error} as CardData}:m));return}
    if(msg.card.audienceType==='b'){
      if(!msg.card.count){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'当前人群为0人，请调整圈选条件后重试。',bFlowId:msg.card.bFlowId}]);return}
      bPackCreated(msg,name.trim());
    }else setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,name:name.trim(),nameError:'',confirmed:true} as CardData}:m));
  };

  const bCloseContent=(draft?:any)=>{
    const id=bModal?.flowId;
    if(reachState.flows[id]?.stage==='content'&&draft)bSetDraft(id,{contentDraft:structuredClone(draft)});
    setBModal(null);
  };
  const bSaveContent=(pack:any)=>{
    const id=bModal?.flowId;
    if(reachState.flows[id]?.stage!=='content')return;
    const confirmed=structuredClone(pack);
    if(bCityConfigError(confirmed)||bContentError(confirmed))return;
    bSetDraft(id,{contentPack:confirmed,contentDraft:confirmed,configured:false,error:''});
    bConfirmStage(id,'content');
    setBModal(null);
    bAdvance(id);
  };

  const bPublishResults=(id:string)=>{const f=reachState.flows[id];bSetDraft(id,{stage:'done'});setBubbles(prev=>{const others=prev.filter(b=>b.id!==id+'-tasks');const ids=[...new Set<string>(f.createResults.filter((r:any)=>r.state==='success'&&r.taskId).map((r:any)=>r.taskId))];const items=ids.flatMap(taskId=>{const t=reachState.tasks.find((t:any)=>t.id===taskId);return t?[{id:t.id,name:t.name,tabName:'[小B任务]'+t.id,channel:t.channels.map(notificationChannelName).join('、')}]:[]});return items.length?[...others,{id:id+'-tasks',type:'task',text:`推送任务(${items.length})`,items}]:others})};
  const bCreate=(id:string)=>{
    const d=reachState.flows[id];
    if(d.stage!=='summary')return;
    const error=bConfigError(d)||validateConfirmCardName(d.taskName||'');
    if(error){bSetDraft(id,{error});return}
    bSetDraft(id,{stage:'creating',operationKey:d.operationKey||crypto.randomUUID(),error:''});
    setTimeout(()=>{
      const f=reachState.flows[id];
      const createResults=f.channels.map((channel:string)=>{
        if((f.demoResult==='partial'&&channel==='企微私聊')||(f.demoResult==='inapp-failed'&&channel===bInAppChannel)){
          return {channel,state:'failed',reason:'模拟渠道暂不可用'};
        }
        if((f.demoResult==='unknown'&&channel==='服务号模板消息通知')||(f.demoResult==='inapp-unknown'&&channel===bInAppChannel)){
          return {channel,state:'unknown',reason:'推送系统未返回创建结果'};
        }
        const task=bCreateSingleTask(f,channel);
        return {channel,state:'success',taskId:task.id};
      });
      bSetDraft(id,{createResults});
      bPublishResults(id);
      bConfirmStage(id,'summary');
      bMessage(id,'result','');
    },400);
  };
  const bAction=(msg:any,action:string,value?:any)=>{const id=msg.card.flowId,f=reachState.flows[id];if(!f||f.stage==='cancelled'||msg.card.invalidated)return;if(mode!=='执行模式'&&action!=='query'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'通知小B仅在执行模式可用，请先切换到执行模式。'}]);return}if(action==='audience'||action==='query'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请先在圈选模式创建人群包，再切换执行模式，@人群包并输入触达要求。'}]);return}else if(action==='content'){if(f.contentPack){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'本次任务城市、免打扰、渠道和内容已确认。',bFlowId:id}]);return}setBModal({kind:'content',flowId:id})}else if(action==='name'){bSetDraft(id,{taskName:value,error:bConfigError(f)})}else if(action==='demo'){bSetDraft(id,{demoResult:value})}else if(action==='create'){bCreate(id)}};
  const bTaskCreated=(msg:any,name:string)=>{const f=reachState.flows[msg.card.bFlowId];if(f?.channels)bCreate(f.id)};
  const handleBIntent=(text:string,referenceIds:string[]=[])=>{
    if(/交付群|群聊|朋友圈|主动激活|(?:使用|引用|用).{0,12}(?:工作流|内容包)/.test(text))return false;
    const referenceMatches=reachState.audiences.filter((a:any)=>{const at='@'+a.name;let from=0,index=-1;while((index=text.indexOf(at,from))>=0){const next=text[index+at.length];if(!next||/[\s，,。；;、]/.test(next))return true;from=index+at.length}return false});
    const selectedReferences=referenceMatches.filter((a:any)=>referenceIds.includes(a.id));
    const resolvedReferences=referenceMatches.filter((a:any)=>!selectedReferences.some((chosen:any)=>chosen.name===a.name)||referenceIds.includes(a.id));
    const startTouch=()=>{
      const accessError=bNotificationAccessError();
      if(accessError){
        setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:accessError+'。'}]);
        return;
      }
      if(mode!=='执行模式'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请切换到执行模式，@人群包并输入触达要求。'}]);return}
      if(resolvedReferences.length!==1){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:resolvedReferences.length>1?'本次触达请只 @一个人群包，并输入触达要求；同名人群包请从引用列表选择。':'请先 @需要触达的人群包，并输入触达要求；不会自动使用刚创建或历史人群包。'}]);return}
      beginBReach(text,resolvedReferences[0],'touch');
    };
    if(/^\/(?:通知小B|小B通知触达|多渠道触达)(?:\s|$)/i.test(text.trim())){startTouch();return true}
    const target=reachAudienceTarget(text);
    const startsSelection=/^(?:\/人群圈选|\/小B圈选|(?:帮我|请|重新|再|新建一轮|新一轮)?\s*(?:圈选|筛选))/.test(text.trim());
    if(startsSelection){
      bTargetRequest.current=null;
      if(target==='b'){if(mode!=='圈选模式'){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请切换到圈选模式，输入需要圈选的人群条件。'}]);return true}beginBReach(text);return true}
      if(target==='c'){bCancelPending();return false} // C端仍由原流程处理，绝不进入小B数据分支。
      bCancelPending();bTargetRequest.current=text;
      setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'请说明要圈选C端用户还是小B，并补充圈选条件。'}]);return true;
    }
    if(bTargetRequest.current&&target){const request=bTargetRequest.current;bTargetRequest.current=null;if(target==='b'){beginBReach(request+'，目标对象：'+text);return true}return false}
    const intent=[...referenceMatches].sort((a,b)=>b.name.length-a.name.length).reduce((value:string,a:any)=>value.split('@'+a.name).join('@人群包'),text);
    if(/小\s*b|经纪人|分销中介|中介/i.test(intent)&&/发|推送|触达|通知/.test(intent)&&reachAudienceTarget(intent)!=='c'){startTouch();return true}
    if(referenceMatches.length&&/发|推送|触达|通知/.test(intent)){
      setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'这次是给经纪人发通知，还是按原流程做企微私聊？请重新 @人群包 并说明用途。'}]);return true;
    }
    const last=[...messages].reverse().find((m:any)=>m.bFlowId||m.card?.flowId||m.bPlanFlowId);const id=last?.bFlowId||last?.card?.flowId||(last as any)?.bPlanFlowId;const old=reachState.flows[id];
    if(old?.stage==='conditions'&&/^(确认|确认条件|确认查询|确认生成|好的|没问题|可以)[。！!\s]*$/.test(text.trim())){bQuery(id);return true}
    const active=old&&!['done','creating','cancelled'].includes(old.stage);
    if(mode!=='执行模式'&&((active&&old.goal==='touch'&&!['conditions','query','preview'].includes(old.stage))||(active&&old.stage==='audience_done'&&/发送|推送|触达|多渠道内容/.test(text))||/多渠道触达|多渠道内容|(?:发送|推送|触达).*(?:小\s*[bB]|经纪人)|(?:小\s*[bB]|经纪人).*(?:发送|推送|触达)/.test(text))){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'通知小B仅在执行模式可用，请先切换到执行模式。'}]);return true}
    if(active&&old.stage==='summary'&&/免打扰/.test(text)){
      setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'免打扰已在触达配置中确认。调整免打扰需发起新一轮触达。',bFlowId:id}]);
      return true;
    }
    const changeChannels=/(?:新增|增加|添加|取消|去掉|删除|移除)\s*(?:一个|这个)?\s*(?:App[ -]?Push|Push|企微|私聊|服务号|渠道)|(?:改为|改成|换成|换为|只用|只发|仅用|仅发)\s*(?:只|仅)?\s*(?:App[ -]?Push|Push|企微|私聊|服务号)|(?:Push|企微|私聊|服务号|渠道).{0,6}(?:取消|删除|移除|去掉)/i.test(text);
    if(active&&old.contentPack?.category&&(/通知类型|消息分类|分类/.test(text)||reachNotificationTypes.some(type=>text.includes(type)))){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'通知类型已在触达配置中确认，本次渠道共用且保持不变；更换分类请发起新一轮触达。发送时间与周期仍可通过自然语言修改。',bFlowId:id}]);return true}
    if(active&&old.contentPack&&(changeChannels||/文案|正文|标题|模板|素材|跳转|客服|发送人|城市|语音|播报|站内/.test(text)||/服务号.{0,8}(?:账号|账户).{0,6}(?:改为|改成|更换)|(?:更换|修改|调整).{0,6}服务号/.test(text))){setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'本次触达城市、渠道及内容已确认，保持不变。频率、周期等推送参数可继续用自然语言修改；更换渠道或内容请发起新一轮多渠道触达。',bFlowId:id}]);return true}
    if(active&&old.goal==='audience'&&['conditions','preview'].includes(old.stage)&&/调整|改为|改成|增加|排除|区域|板块|注册ID/.test(text)&&/付费|体验|注销|区域|板块|雁塔|未央|碑林|注册ID|DEMO-B-|圈选/.test(text)){const parsed=reachParse(text);const q={...old.query,issue:parsed.issue};if(/付费|体验|注销/.test(text))q.statuses=parsed.statuses;if(/雁塔|未央|碑林/.test(text))q.area=parsed.area;if(/高新|经开|南门/.test(text))q.block=parsed.block;if(/DEMO-B-/.test(text))q.ids=parsed.ids;bInvalidate(id);bSetDraft(id,{query:q,audience:null,configured:false,stage:'conditions'});bMessage(id,'conditions','');return true}
    if(active&&['content','summary'].includes(old.stage)&&/推送|触达|发送|定时|立即|即时|每天|每日|每周|每星期|每月|每隔|周期|频率|时|点|间隔|城市|客服|平台类|业务类|系统类|商业类/i.test(text)){
      const requirements=bParseTouch(text,old.requirements);
      if(old.stage==='summary'){
        bInvalidate(id);
        bSetDraft(id,{requirements,configured:false});
        bMakeSummary(id);
      }else{
        bSetDraft(id,{requirements});
        setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'已更新触达要求，完成当前配置后将在任务确认中展示。',bFlowId:id}]);
      }
      return true;
    }
    return false;
  };

  useEffect(()=>{
    const syncReachResources=()=>{
      setAudienceResources(prev=>[...reachState.audiences.map((a:any)=>makeAudienceResource({id:a.id,name:a.name,tabName:'[人群包]'+a.id},{audienceCount:a.count,createdAt:a.created,updatedAt:a.created,updatedOrder:Number(a.id.split('-').pop()),configSnapshot:['对象：小B','城市：'+a.query.city,'经纪人状态：'+a.query.statuses.join(' 或 '),'区域：'+a.query.area,'板块：'+a.query.block],relatedTaskCount:reachState.tasks.filter(t=>t.audience.id===a.id).length,type:'AI人群包'})),...prev.filter(a=>!a.id.startsWith('DEMO-A-'))]);
      setPushTaskResources(prev=>[...reachState.tasks.filter((t:any)=>!t.pushBinding&&t.source!=='SOP').map((t:any)=>makePushTaskResource({id:t.id,name:t.name,tabName:'[小B任务]'+t.id},{status:t.status,pushType:t.channels.map(notificationChannelName).join('、'),relatedAudienceName:reachState.audiences.find(a=>a.id===t.audience.id)?.name||t.audience.name,estimatedReach:t.audience.count,pushTime:t.sendMode==='周期发送'?bScheduleLabel(t):t.sendMode==='定时发送'?t.sendTime.replace('T',' '):t.sendMode,createdAt:t.created,updatedOrder:Number(t.id.split('-').pop())})),...prev.filter(t=>!t.id.startsWith('DEMO-T-')&&!t.id.startsWith('DEMO-INAPP-')&&!reachState.tasks.some((x:any)=>x.id===t.id&&(x.pushBinding||x.source==='SOP')))]);
    };
    syncReachResources();window.addEventListener('b-reach-change',syncReachResources);return()=>window.removeEventListener('b-reach-change',syncReachResources);
  },[]);

  const [audienceResources, setAudienceResources] = useState<AudienceResource[]>(initialAudienceResources);
  const [groupResources, setGroupResources] = useState<GroupResource[]>(initialGroupResources);
  const [pushTaskResources, setPushTaskResources] = useState<PushTaskResource[]>(initialPushTaskResources);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [renamingResource, setRenamingResource] = useState<{ type: 'audience' | 'group' | 'task'; id: string } | null>(null);
  const [resourceRenameValue, setResourceRenameValue] = useState('');
  const [resourceRenameError, setResourceRenameError] = useState('');
  const [resourceToast, setResourceToast] = useState('');
  const [mode, setMode] = useState<'圈选模式' | '执行模式'>('圈选模式');
  const [inputValue, setInputValue] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<1 | 2 | null>(null);
  const [slideOverUser, setSlideOverUser] = useState<string | null>(null);
  const [slideOverList, setSlideOverList] = useState<string[]>([]);
  const [slideOverTab, setSlideOverTab] = useState<SelectionInfoTab>('记忆');
  const [isAudienceSamplePreview, setIsAudienceSamplePreview] = useState(false);
  const [activeBubbleId, setActiveBubbleId] = useState<string | null>(null);
  const [inputLocked, setInputLocked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyView, setHistoryView] = useState<'active' | 'archived'>('active');
  const [openHistoryMenuId, setOpenHistoryMenuId] = useState<string | null>(null);
  const [renamingHistoryItem, setRenamingHistoryItem] = useState<AssistantHistoryItem | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [archiveConfirmItem, setArchiveConfirmItem] = useState<AssistantHistoryItem | null>(null);
  const [historyItems, setHistoryItems] = useState<AssistantHistoryItem[]>([
    { id: 'hefei-school-push', title: '圈选合肥学区房用户并推送活动', date: '今天 10:30', sortTime: 3, crowdPackCount: 1, groupPackCount: 1, pushTaskCount: 2, isPinned: true, isArchived: false },
    { id: 'moments-copy', title: '生成朋友圈文案', date: '昨天 15:20', sortTime: 2, crowdPackCount: 0, groupPackCount: 0, pushTaskCount: 0, isPinned: false, isArchived: false },
    { id: 'churn-analysis', title: '分析近期客户流失原因', date: '3月1日 09:15', sortTime: 1, crowdPackCount: 1, groupPackCount: 0, pushTaskCount: 0, isPinned: false, isArchived: false },
    { id: 'old-group-push', title: '南京新房群聊推送复盘', date: '2月18日 16:40', sortTime: 0, crowdPackCount: 0, groupPackCount: 1, pushTaskCount: 1, isPinned: false, isArchived: true }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const demoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputValueRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if(document.activeElement?.closest('[data-testid="audience-preview-card"] input'))return;
    scrollToBottom();
  }, [messages, bubbles, slideOverUser]);

  // Sync ref with state for manual typing
  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  // Demo Runner Logic
  useEffect(() => {
    if (!isPlaying || currentScenario === null) return;

    const script1 = [
      { type: 'SET_MODE', payload: '圈选模式', delay: 500 },
      { type: 'TYPE_TEXT', payload: '帮我圈选合肥市有学区房需求的用户，预算在 100 万左右。', delay: 800 },
      { type: 'SEND_MESSAGE', delay: 500 },
      { type: 'ADD_TASK_PLAN', payload: [{id: '1', text: '意图解析：合肥市+学区房需求', status: 'loading'}], delay: 800 },
      { type: 'UPDATE_TASK_PLAN', payload: [{id: '1', text: '意图解析：合肥市+学区房需求', status: 'done'}, {id: '2', text: '计划拆解：提取城市、需求标签', status: 'loading'}], delay: 800 },
      { type: 'UPDATE_TASK_PLAN', payload: [{id: '1', text: '意图解析：合肥市+学区房需求', status: 'done'}, {id: '2', text: '计划拆解：提取城市、需求标签', status: 'done'}], delay: 800 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '已锁定合肥市学区房需求群体，请问预算范围是？', delay: 500 },
      { type: 'TYPE_TEXT', payload: '100 万以内', delay: 1500 },
      { type: 'SEND_MESSAGE', delay: 500 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: audienceConditionsText(['目标对象：C端用户','城市：合肥市','需求：学区房','预算：100万以内']), delay: 500 },
      { type: 'TYPE_TEXT', payload: '确认', delay: 1500 },
      { type: 'SEND_MESSAGE', delay: 500 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: audiencePreviewText, delay: 500 },
      { type: 'ADD_CARD', payload: { type: 'audience', name: '合肥100w学区房', count: 1285, updateCycle: 'once', samples: ['张三', '李四', '王五'] }, delay: 1000 },
      { type: 'OPEN_SLIDE_OVER', payload: '张三', delay: 1500 },
      { type: 'CLOSE_SLIDE_OVER', delay: 2500 },
      { type: 'CLICK_CARD_CONFIRM', delay: 1000 },
      { type: 'SEND_MESSAGE_DIRECT', payload: '确认创建', delay: 500 },
      { type: 'LOCK_INPUT', delay: 0 },
      { type: 'ADD_PROGRESS', payload: 0, delay: 500 },
      { type: 'UPDATE_PROGRESS', payload: 50, delay: 800 },
      { type: 'UPDATE_PROGRESS', payload: 100, delay: 800 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '人群包‘合肥100w学区房’已创建完成。', actionButton: { label: '查看详情', tabName: '[AI] 合肥100w学区房' }, delay: 500 },
      { type: 'ADD_BUBBLE', payload: { id: 'b1', type: 'audience', text: '人群包(1)', items: [{ id: 'i1', name: '合肥100w学区房', tabName: '[AI] 合肥100w学区房' }] }, delay: 1000 },
      { type: 'ADD_BUBBLE', payload: { id: 'b3', type: 'group', text: '群聊包(1)', items: [{ id: 'i3', name: '合肥100w学区房群', tabName: '[AI] 合肥100w学区房群' }] }, delay: 500 },
      { type: 'TOGGLE_BUBBLE', payload: 'b1', delay: 1500 },
      { type: 'CLICK_BUBBLE_ITEM', payload: '[AI] 合肥100w学区房', delay: 1500 },
      { type: 'END', delay: 0 }
    ];

    const script2 = [
      { type: 'SET_MODE', payload: '执行模式', delay: 500 },
      { type: 'TYPE_TEXT', payload: '每天中午 11:30，私聊发送【限时特惠】合肥政务区学区房最新名单已出，点击查看...，发送人选择 C 端客服。', delay: 800 },
      { type: 'SEND_MESSAGE', delay: 500 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '已为您生成推送内容预览，请确认内容是否正确？', delay: 1000 },
      { type: 'ADD_CARD', payload: { type: 'content_preview', title: '素材预览', content: '【限时特惠】合肥政务区学区房最新名单已出，点击查看...' }, delay: 500 },
      { type: 'TYPE_TEXT', payload: '没问题', delay: 2000 },
      { type: 'SEND_MESSAGE', delay: 500 },
      { type: 'ADD_CARD', payload: { type: 'config', senders: ['C端客服'], blacklists: [] }, delay: 1000 },
      { type: 'CLICK_CARD_CONFIRM', delay: 1500 },
      { type: 'SEND_MESSAGE_DIRECT', payload: '确认配置', delay: 500 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '请确认最终任务信息：', delay: 500 },
      { type: 'ADD_CARD', payload: {
        type: 'task_summary',
        taskName: '每日私聊推送_学区房名单',
        channel: '企微私聊',
        pushTime: '每日 11:30',
        pushInterval: '每天',
        recipient: '合肥100w学区房 (1,285人)',
        sender: 'C端客服',
        content: '【限时特惠】合肥政务区学区房最新名单已出，点击查看...'
      }, delay: 1000 },
      { type: 'CLICK_CARD_CONFIRM', delay: 1500 },
      { type: 'SEND_MESSAGE_DIRECT', payload: '确认执行任务', delay: 500 },
      { type: 'ADD_PROGRESS', payload: 0, delay: 500 },
      { type: 'UPDATE_PROGRESS', payload: 30, delay: 800 },
      { type: 'TYPE_TEXT', payload: '停一下', delay: 500 },
      { type: 'SEND_MESSAGE', delay: 500 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '任务已锁定，无法中止。', delay: 500 },
      { type: 'UPDATE_PROGRESS', payload: 100, delay: 1000 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '推送任务已排期成功！\n\n任务名称：每日私聊推送_学区房名单\n预估覆盖：1,285 人\n发送内容：【限时特惠】合肥政务区学区房最新名单已出...\n发送人：C端客服\n黑名单过滤：未设置\n执行时间：每日 11:30', actionButton: { label: '查看详情', tabName: '[AI] 每日私聊推送_学区房名单' }, delay: 500 },
      { type: 'ADD_BUBBLE', payload: { id: 'b2', type: 'task', text: '推送任务(1)', items: [{ id: 'i2', name: '每日私聊推送_学区房名单', tabName: '[AI] 每日私聊推送_学区房名单' }] }, delay: 1000 },
      { type: 'ADD_USER_MESSAGE', payload: '基于刚才圈选出的合肥100w学区房群，做一次新房测评的群聊推送', delay: 2000 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '好的，正在为您配置群聊推送任务。\n\n已为您生成推送内容预览，请确认内容是否正确？', delay: 1000 },
      { type: 'ADD_AI_CARD', payload: { type: 'content_preview', title: '素材预览', content: '🏢江核低密洋房+四代宅\n🚇双地铁+金陵中学分校\n💥实用率最高可达109%\n💰现在单价2万多就能入手\n👉详细测评已出炉，点击查看[淘房小程序]' }, delay: 1000 },
      { type: 'ADD_USER_MESSAGE', payload: '没问题，确认执行', delay: 2000 },
      { type: 'ADD_AI_MESSAGE_STREAM', payload: '群聊推送任务已排期成功！\n\n任务名称：0331-全群-映象星潮\n接收群：南京AI控制台验证群\n发送内容：文本 + 淘房小程序\n发送人：365房博士好好\n执行时间：即时推送', actionButton: { label: '查看详情', tabName: '[AI] 群推送_映象星潮' }, delay: 1000 },
      { type: 'UPDATE_BUBBLE', payload: { id: 'b2', type: 'task', text: '推送任务(2)', items: [
        { id: 'i2', name: '每日私聊推送_学区房名单', tabName: '[AI] 每日私聊推送_学区房名单' },
        { id: 'i4', name: '0331-全群-映象星潮', tabName: '[AI] 群推送_映象星潮' }
      ] }, delay: 500 },
      { type: 'TOGGLE_BUBBLE', payload: 'b2', delay: 1500 },
      { type: 'CLICK_BUBBLE_ITEM', payload: '[AI] 每日私聊推送_学区房名单', delay: 1500 },
      { type: 'END', delay: 0 }
    ];

    const currentScript = currentScenario === 1 ? script1 : script2;
    const step = currentScript[demoStep];

    if (!step) {
      setIsPlaying(false);
      return;
    }

    demoTimeoutRef.current = setTimeout(() => {
      switch (step.type) {
        case 'SET_MODE':
          setMode(step.payload as any);
          setDemoStep(s => s + 1);
          break;
        case 'TYPE_TEXT':
          let i = 0;
          inputValueRef.current = '';
          const text = step.payload as string;
          const typeChar = () => {
            if (i < text.length) {
              inputValueRef.current += text.charAt(i);
              setInputValue(inputValueRef.current);
              i++;
              demoTimeoutRef.current = setTimeout(typeChar, 30);
            } else {
              setDemoStep(s => s + 1);
            }
          };
          typeChar();
          return;
        case 'SEND_MESSAGE': {
          const text = inputValueRef.current;
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
          setInputValue('');
          inputValueRef.current = '';
          setDemoStep(s => s + 1);
          break;
        }
        case 'SEND_MESSAGE_DIRECT':
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: step.payload as string }]);
          setDemoStep(s => s + 1);
          break;
        case 'ADD_TASK_PLAN':
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', taskPlan: step.payload as TaskItem[] }]);
          setDemoStep(s => s + 1);
          break;
        case 'UPDATE_TASK_PLAN':
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg && lastMsg.role === 'ai') {
              lastMsg.taskPlan = step.payload as TaskItem[];
            }
            return newMsgs;
          });
          setDemoStep(s => s + 1);
          break;
        case 'ADD_AI_MESSAGE_STREAM':
          const msgId = Date.now().toString();
          setMessages(prev => [...prev, { id: msgId, role: 'ai', content: '', actionButton: step.actionButton as any }]);
          let streamI = 0;
          const streamText = step.payload as string;
          const streamChar = () => {
            if (streamI < streamText.length) {
              setMessages(prev => {
                const newMsgs = [...prev];
                const target = newMsgs.find(m => m.id === msgId);
                if (target) {
                  target.content = streamText.substring(0, streamI + 1);
                }
                return newMsgs;
              });
              streamI++;
              demoTimeoutRef.current = setTimeout(streamChar, 30);
            } else {
              setDemoStep(s => s + 1);
            }
          };
          streamChar();
          return;
        case 'ADD_CARD':
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            // If the last message is AI and doesn't have a card, attach it.
            // BUT, if the last message is AI and HAS content, maybe we want to attach to it?
            // Or create a new message?
            // In script2, we have ADD_AI_MESSAGE_STREAM then ADD_CARD.
            // We should probably attach to the last message if it's AI and has no card.
            if (lastMsg && lastMsg.role === 'ai' && !lastMsg.card) {
                lastMsg.card = step.payload as CardData;
            } else {
                newMsgs.push({ id: Date.now().toString(), role: 'ai', card: step.payload as CardData });
            }
            return newMsgs;
          });
          setDemoStep(s => s + 1);
          break;
        case 'OPEN_SLIDE_OVER':
          setSlideOverUser(step.payload as string);
          setSlideOverList([]);
          setDemoStep(s => s + 1);
          break;
        case 'CLOSE_SLIDE_OVER':
          setSlideOverUser(null);
          setSlideOverList([]);
          setDemoStep(s => s + 1);
          break;
        case 'CLICK_CARD_CONFIRM':
          setMessages(prev => {
            const newMsgs = [...prev];
            // Find the last card and mark confirmed
            for (let i = newMsgs.length - 1; i >= 0; i--) {
                if (newMsgs[i].card) {
                    newMsgs[i].card!.confirmed = true;
                    break;
                }
            }
            return newMsgs;
          });
          setDemoStep(s => s + 1);
          break;
        case 'LOCK_INPUT':
          setInputLocked(true);
          setDemoStep(s => s + 1);
          break;
        case 'ADD_PROGRESS':
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', progress: step.payload as number }]);
          setDemoStep(s => s + 1);
          break;
        case 'UPDATE_PROGRESS':
           setMessages(prev => {
            const newMsgs = [...prev];
            for (let i = newMsgs.length - 1; i >= 0; i--) {
                if (newMsgs[i].progress !== undefined) {
                    newMsgs[i].progress = step.payload as number;
                    break;
                }
            }
            return newMsgs;
          });
          setDemoStep(s => s + 1);
          break;
        case 'ADD_BUBBLE':
          setBubbles(prev => [...prev, step.payload as Bubble]);
          if ((step.payload as Bubble).type === 'audience') {
            upsertAudienceResourcesFromItems((step.payload as Bubble).items);
            setResourceView('audience');
          }
          if ((step.payload as Bubble).type === 'group') {
            upsertGroupResourcesFromItems((step.payload as Bubble).items);
            setResourceView('group');
          }
          if ((step.payload as Bubble).type === 'task') {
            upsertPushTaskResourcesFromItems((step.payload as Bubble).items);
            setResourceView('task');
          }
          setDemoStep(s => s + 1);
          break;
        case 'UPDATE_BUBBLE':
          setBubbles(prev => prev.map(b => b.id === (step.payload as Bubble).id ? step.payload as Bubble : b));
          if ((step.payload as Bubble).type === 'audience') {
            upsertAudienceResourcesFromItems((step.payload as Bubble).items);
            setResourceView('audience');
          }
          if ((step.payload as Bubble).type === 'group') {
            upsertGroupResourcesFromItems((step.payload as Bubble).items);
            setResourceView('group');
          }
          if ((step.payload as Bubble).type === 'task') {
            upsertPushTaskResourcesFromItems((step.payload as Bubble).items);
            setResourceView('task');
          }
          setDemoStep(s => s + 1);
          break;
        case 'TOGGLE_BUBBLE':
          setActiveBubbleId(step.payload as string);
          setDemoStep(s => s + 1);
          break;
        case 'CLICK_BUBBLE_ITEM':
          onOpenTab(step.payload as string);
          onClose();
          setDemoStep(s => s + 1);
          break;
        case 'END':
          setIsPlaying(false);
          setCurrentScenario(null);
          setInputLocked(false);
          setDemoStep(s => s + 1);
          break;
      }
    }, step.delay);

    return () => {
      if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
    };
  }, [isPlaying, demoStep, currentScenario]);

  const startDemo = (scenario: 1 | 2) => {
    setInputValue('');
    inputValueRef.current = '';
    setSlideOverUser(null);
    setSlideOverList([]);
    setActiveBubbleId(null);
    setInputLocked(false);
    setDemoStep(0);
    setCurrentScenario(scenario);
    setIsPlaying(true);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    setInputLocked(false);
    if (demoTimeoutRef.current) clearTimeout(demoTimeoutRef.current);
  };

  const upsertAudienceResourcesFromItems = (items: { id: string; name: string; tabName: string }[]) => {
    setAudienceResources(prev => {
      const next = [...prev];
      items.forEach(item => {
        const existingIndex = next.findIndex(resource => resource.id === item.id);
        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], name: item.name, tabName: item.tabName };
        } else {
          next.push(makeAudienceResource(item));
        }
      });
      return next;
    });
    if (items[0]) setSelectedResourceId(items[0].id);
  };

  const upsertPushTaskResourcesFromItems = (items: { id: string; name: string; tabName: string }[]) => {
    setPushTaskResources(prev => {
      const next = [...prev];
      items.forEach(item => {
        const existingIndex = next.findIndex(resource => resource.id === item.id);
        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], name: item.name, tabName: item.tabName };
        } else {
          next.push(makePushTaskResource(item));
        }
      });
      return next;
    });
    if (items[0]) setSelectedResourceId(items[0].id);
  };

  const upsertGroupResourcesFromItems = (items: { id: string; name: string; tabName: string }[]) => {
    setGroupResources(prev => {
      const next = [...prev];
      items.forEach(item => {
        const existingIndex = next.findIndex(resource => resource.id === item.id);
        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], name: item.name, tabName: item.tabName };
        } else {
          next.push(makeGroupResource(item));
        }
      });
      return next;
    });
    if (items[0]) setSelectedResourceId(items[0].id);
  };

  const syncBubbleItems = (type: 'audience' | 'group' | 'task', resources: Array<AudienceResource | GroupResource | PushTaskResource>) => {
    setBubbles(prev => {
      const bubbleId = type === 'audience' ? 'b1' : type === 'group' ? 'b3' : 'b2';
      const bubbleText = type === 'audience' ? `人群包(${resources.length})` : type === 'group' ? `群聊包(${resources.length})` : `推送任务(${resources.length})`;
      const nextItems = resources.map(resource => ({ id: resource.id, name: resource.name, tabName: resource.tabName }));
      const existing = prev.find(bubble => bubble.id === bubbleId || bubble.type === type);
      if (!existing) {
        return [
          ...prev,
          { id: bubbleId, type, text: bubbleText, items: nextItems }
        ];
      }
      return prev.map(bubble => (bubble.id === existing.id ? { ...bubble, text: bubbleText, items: nextItems } : bubble));
    });
  };

  const openRenameResource = (type: 'audience' | 'group' | 'task', id: string, name: string) => {
    setRenamingResource({ type, id });
    setResourceRenameValue(name);
    setResourceRenameError('');
  };

  const hasDuplicateResourceName = (type: 'audience' | 'group' | 'task', id: string, name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return false;
    if (type === 'audience') return audienceResources.some(resource => resource.id !== id && resource.name === normalizedName);
    if (type === 'group') return groupResources.some(resource => resource.id !== id && resource.name === normalizedName);
    return pushTaskResources.some(resource => resource.id !== id && resource.name === normalizedName);
  };

  const confirmRenameResource = () => {
    const nextName = resourceRenameValue.trim();
    if (!renamingResource || !nextName) return;

    if (hasDuplicateResourceName(renamingResource.type, renamingResource.id, nextName)) {
      setResourceRenameError('名称已存在，请调整');
      setResourceToast('名称已存在，请调整');
      setTimeout(() => setResourceToast(''), 1800);
      return;
    }

    if (renamingResource.type === 'audience') {
      const current = audienceResources.find(resource => resource.id === renamingResource.id);
      const oldName = current?.name;
      const next = audienceResources.map(resource => resource.id === renamingResource.id ? { ...resource, name: nextName, updatedAt: '刚刚', updatedOrder: Date.now() } : resource);
      setAudienceResources(next);
      if (oldName) {
        setPushTaskResources(prev => prev.map(resource => resource.relatedAudienceName === oldName ? { ...resource, relatedAudienceName: nextName } : resource));
      }
      syncBubbleItems('audience', next);
      if (current) onRenameOpenedTab?.(current.tabName, `[AI] ${nextName}`);
    } else if (renamingResource.type === 'group') {
      const current = groupResources.find(resource => resource.id === renamingResource.id);
      const oldName = current?.name;
      const next = groupResources.map(resource => resource.id === renamingResource.id ? { ...resource, name: nextName, updatedAt: '刚刚', updatedOrder: Date.now() } : resource);
      setGroupResources(next);
      if (oldName) {
        setPushTaskResources(prev => prev.map(resource => resource.relatedAudienceName === oldName ? { ...resource, relatedAudienceName: nextName } : resource));
      }
      syncBubbleItems('group', next);
      if (current) onRenameOpenedTab?.(current.tabName, `[AI] ${nextName}`);
    } else {
      const current = pushTaskResources.find(resource => resource.id === renamingResource.id);
      const next = pushTaskResources.map(resource => resource.id === renamingResource.id ? { ...resource, name: nextName, updatedAt: '刚刚', updatedOrder: Date.now() } : resource);
      setPushTaskResources(next);
      syncBubbleItems('task', next);
      if (current) onRenameOpenedTab?.(current.tabName, nextName);
    }

    if(renamingResource.id.startsWith('DEMO-')){
      if(renamingResource.type==='audience')reachState.audiences=reachState.audiences.map(a=>a.id===renamingResource.id?{...a,name:nextName}:a);
      else reachState.tasks=reachState.tasks.map(t=>t.id===renamingResource.id?{...t,name:nextName}:t);
      reachCommit();
    }
    setRenamingResource(null);
    setResourceRenameValue('');
    setResourceRenameError('');
  };

  const copyTextForDemo = async (text: string) => {
    const legacyCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      } finally {
        document.body.removeChild(textarea);
      }
      return copied;
    };

    if (legacyCopy()) return true;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Some embedded preview browsers block the async clipboard API.
    }

    try {
      window.localStorage.setItem('aiAssistantCopiedConditions', text);
      (window as any).__aiAssistantCopiedConditions = text;
    } catch (error) {
      (window as any).__aiAssistantCopiedConditions = text;
    }

    return true;
  };

  const showCopySuccessToast = () => {
    setResourceToast('复制成功，可粘贴到对话框使用');
    setTimeout(() => setResourceToast(''), 1800);
  };

  const copyAudienceConditions = async (resource: AudienceResource) => {
    const text = [`人群包：${resource.name}`, ...resource.configSnapshot].join('\n');
    try {
      await copyTextForDemo(text);
      showCopySuccessToast();
    } catch (error) {
      setResourceToast('复制成功，可粘贴到对话框使用');
      setTimeout(() => setResourceToast(''), 1800);
    }
  };

  const copyGroupConditions = async (resource: GroupResource) => {
    const text = [`群聊包：${resource.name}`, ...resource.configSnapshot].join('\n');
    try {
      await copyTextForDemo(text);
      showCopySuccessToast();
    } catch (error) {
      setResourceToast('复制成功，可粘贴到对话框使用');
      setTimeout(() => setResourceToast(''), 1800);
    }
  };

  const useAudienceForPush = (resource: AudienceResource) => {
    if(resource.id.startsWith('DEMO-A-')){setResourceView('chat');setMode('执行模式');bInputAudienceIds.current=[resource.id];const text='@'+resource.name+' ';setInputValue(text);inputValueRef.current=text;return;}
    setResourceView('chat');
    setMode('执行模式');
    setInputValue(`基于 @${resource.name} 创建一次私聊推送 `);
    inputValueRef.current = `基于 @${resource.name} 创建一次私聊推送 `;
  };

  const useGroupForPush = (resource: GroupResource) => {
    setResourceView('chat');
    setMode('执行模式');
    setInputValue(`基于 @${resource.name} 创建一次群聊推送 `);
    inputValueRef.current = `基于 @${resource.name} 创建一次群聊推送 `;
  };

  const markActivationCard = (id: string) => setMessages(prev=>prev.map(m=>m.id===id?{...m,card:{...m.card,confirmed:true} as CardData}:m));
  const addActivationCard = (card: any, content = '') => setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content,card}]);
  const currentActivationAudiences = () => {
    const names=new Set(messages.filter(m=>m.card?.type==='audience'&&m.card.confirmed).map(m=>m.card.name));
    bubbles.filter(b=>b.type==='audience').forEach(b=>b.items.forEach(i=>names.add(i.name)));
    return audienceResources.filter(a=>names.has(a.name)&&!a.id.startsWith('DEMO-A-'));
  };
  const activationPreview = (draft: any) => {
    const revision=activationRevisions[draft.strategyId];
    return {...draft,previewRev:revision,preview:activationMessages(draft.strategyId,revision,draft.audience.includes('南京')?'家和万事兴':'橙子')};
  };
  const beginActivationRun = (result: any, card?: any, planId?: string, after?: () => void, keepInputLocked = false) => {
    setInputLocked(true);
    const loadingId=crypto.randomUUID();
    setMessages(prev=>[...prev,{id:loadingId,role:'ai',loading:true}]);
    setTimeout(()=>{
      setMessages(prev=>{
        const next=prev.filter(m=>m.id!==loadingId).map(m=>m.id===planId?{...m,taskPlan:m.taskPlan?.map(task=>({...task,status:'done'}))}:m);
        next.push({id:crypto.randomUUID(),role:'ai',...(typeof result==='string'?{content:result}:result)});
        if(card) next.push({id:crypto.randomUUID(),role:'ai',card});
        return next;
      });
      after?.();
      if(!keepInputLocked)setInputLocked(false);
    },900);
  };
  const activationChoice = (draft: any, pushContext: any) => {
    const audiences=currentActivationAudiences();
    const audience=audiences.find(a=>a.name===draft.audience);
    const taskDraft={...draft,...pushContext,blacklist:pushContext.blacklist || draft.blacklist || []};
    if(audience && audience.audienceCount && draft.strategyId){
      const planId=crypto.randomUUID();
      setMessages(prev=>[...prev,{id:planId,role:'ai',taskPlan:[
        {id:'identify',text:'识别人群包和主动激活策略',status:'loading'},
        {id:'sample',text:'获取样本用户信息',status:'wait'},
        {id:'generate',text:'生成内容示例',status:'wait'},
        {id:'confirm',text:'生成内容确认卡',status:'wait'}
      ]}]);
      const content=activationPreview(taskDraft);
      beginActivationRun(`已生成主动激活策略「${activationCategories.find(c=>c.id===draft.strategyId).name}」内容示例，请确认。`,{type:'proactive_choice',draft:content,audiences,pushContext},planId,undefined,true);
      return;
    }
    setInputLocked(true);
    addActivationCard({type:'proactive_choice',draft:taskDraft,audiences,pushContext});
  };
  const activationRefresh = (msg: any,draft: any) => {
    const audiences=currentActivationAudiences();
    const audience=audiences.find(a=>a.name===draft.audience);
    if(!audience || !audience.audienceCount || !draft.strategyId){
      setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,draft,loading:false,audiences}}:m));
      return;
    }
    setInputLocked(true);
    const nextDraft={...draft,generationError:''};
    setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,loading:true,draft:nextDraft,audiences}}:m));
    setTimeout(()=>{setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,loading:false,draft:activationPreview(nextDraft),audiences}}:m));},450);
  };
  const activationRetry = (msg: any) => activationRefresh(msg,{...msg.card.draft,generationError:''});
  const activationConfirmed = (msg: any) => {
    if(msg.card.confirmed)return;
    markActivationCard(msg.id);
    const draft=msg.card.draft;
    beginActivationRun('请确认推送任务配置。',{type:'config',senders:[draft.sender],blacklists:draft.blacklist,proactive:draft});
  };
  const activationConfigured = (msg: any, config: any) => {
    markActivationCard(msg.id);const draft={...msg.card.proactive,...config};
    const category=activationCategories.find(c=>c.id===draft.strategyId);
    beginActivationRun('请确认任务信息。',{type:'task_summary',taskName:category.name+'_私聊',channel:activationChannel('active',draft.city),pushTime:draft.pushTime,pushInterval:draft.interval+' 秒',recipient:draft.audience,sender:draft.sender,content:'主动激活策略：'+category.name,proactive:draft});
  };
  const activationCreated = (msg: any, name: string) => {
    if(msg.card.confirmed)return;
    markActivationCard(msg.id);
    const id='ACTTASK-'+Date.now();const draft={...msg.card.proactive,name,runs:[],cancelled:false,createdAt:'刚刚',audienceCount:audienceResources.find(a=>a.name===msg.card.proactive.audience)?.audienceCount || 0,audienceUpdatedAt:'刚刚'};activationTasks[id]=draft;
    const route='[主动激活任务]'+id;
    const item={id,name,tabName:route};
    const resource=makePushTaskResource(item,{status:'待执行',relatedAudienceName:draft.audience,pushTime:draft.pushTime,estimatedReach:audienceResources.find(a=>a.name===draft.audience)?.audienceCount||0,configSnapshot:['主动激活策略：'+activationCategories.find(c=>c.id===draft.strategyId).name,'策略 ID：'+draft.strategyId,'通道：'+activationChannel('active',draft.city)]});
    beginActivationRun({content:'任务创建成功。',actionButton:{label:'查看主动激活任务详情',tabName:route}},undefined,undefined,()=>{setPushTaskResources(prev=>[...prev,resource]);syncBubbleItems('task',[...pushTaskResources,resource]);});
  };
  const handleSendMessage = (text: string, images?: string[]) => {
    if ((!text.trim() && (!images || images.length === 0)) || inputLocked || bConfigPending) return;

    // 使用全局 logEvent 避免闭包引用问题
    window.logEvent('send_message', { length: text.length, hasImages: !!images });

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, images }]);
    setInputValue('');
    inputValueRef.current = '';
    const referenceIds=[...bInputAudienceIds.current];bInputAudienceIds.current=[];
    if(handleBIntent(text,referenceIds))return;
    if(/^(?:确认|确认创建|确认创建人群包|好的|没问题|可以)[。！!\s]*$/.test(text.trim())){
      const latestCard=[...messages].reverse().find(m=>m.card&&!m.card.invalidated);
      if(latestCard?.card?.type==='audience'){
        if(latestCard.card.confirmed)setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'ai',content:'该人群包已确认创建，无需重复确认。'}]);
        else confirmAudience(latestCard);
        return;
      }
    }
    const pending=[...messages].reverse().find(m=>m.card?.type==='proactive_choice'&&!m.card.confirmed);
    const matched=activationCategories.filter(c=>text.includes(c.name));
    const available=currentActivationAudiences();
    const selected=available.filter(a=>text.includes(a.name));
    const changesContent=matched.length>0 || selected.length>0 || /人群包|策略|主动激活|引用/.test(text);
    if(pending&&changesContent){
      let error='';let draft={...pending.card.draft};
      if(matched.length===1)draft.strategyId=matched[0].id;
      else if(/策略/.test(text))error='请明确一个主动激活策略。';
      if(selected.length===1)draft.audience=selected[0].name;
      else if(/人群包|引用/.test(text))error=selected.length>1?'匹配到多个人群包，请在卡片内选择。':'未匹配到当前会话人群包，请在卡片内选择。';
      activationRefresh(pending,{...draft,error});
      return;
    }
    if(text.includes('主动激活') || matched.length){
      const time=text.match(/(?:[01]?\d|2[0-3]):[0-5]\d/);
      activationChoice({audience:selected.length===1?selected[0].name:'',strategyId:matched.length===1?matched[0].id:''},{city:['南京','合肥','无锡','苏州','西安','芜湖'].find(c=>text.includes(c))||'合肥',sender:'C端客服',pushTime:text.includes('每天')?'每天 '+(time?time[0].padStart(5,'0'):'11:30'):'即时推送',interval:'5～10',blacklist:['中介同行','无购房需求','频繁转派用户','同事']});return;
    }
    const summary=[...messages].reverse().find(m=>m.card?.type==='task_summary'&&m.card.proactive&&!m.card.confirmed);
    if(summary&&/时间|间隔|每天|即时推送/.test(text)){
      const t=text.match(/(?:[01]?\d|2[0-3]):[0-5]\d/),gap=text.match(/间隔[^\d]*(\d+(?:[～~—-]\d+)?)/);
      const draft={...summary.card.proactive};
      if(t)draft.pushTime=(text.includes('每天')?'每天 ':'定时 ')+t[0].padStart(5,'0');
      if(text.includes('即时推送'))draft.pushTime='即时推送';
      if(gap)draft.interval=gap[1];
      setMessages(prev=>prev.map(m=>m.id===summary.id?{...m,card:{...m.card,pushTime:draft.pushTime,pushInterval:draft.interval+' 秒',proactive:draft}}:m));return;
    }
    setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: '收到您的指令，正在处理中...' }]);
    }, 500);
  };

  const handleNewChat = () => {
    bCancelPending();bInputAudienceIds.current=[];setMode('圈选模式');
    setMessages([{ id: Date.now().toString(), role: 'ai', content: '你好！我是你的 AI 私域助手。有什么我可以帮你的？' }]);
    setBubbles([]);
    setResourceView('chat');
    setResourceSearch('');
    setSelectedResourceId(null);
    setRenamingResource(null);
    setAudienceMemberPreview(null);
    setInputValue('');
    inputValueRef.current = '';
    setSlideOverUser(null);
    setSlideOverList([]);
    setActiveBubbleId(null);
    setInputLocked(false);
    stopDemo();
  };

  const sortedHistoryItems = historyItems
    .filter(item => historyView === 'archived' ? item.isArchived : !item.isArchived)
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.sortTime - a.sortTime);

  const updateHistoryItem = (id: string, patch: Partial<AssistantHistoryItem>) => {
    setHistoryItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const openHistoryPanel = () => {
    setHistoryView('active');
    setOpenHistoryMenuId(null);
    setShowHistory(true);
  };

  const handleOpenHistoryItem = (item: AssistantHistoryItem) => {
    setOpenHistoryMenuId(null);
    if (item.id === 'hefei-school-push') {
      loadHistoryDemo();
      return;
    }
    setShowHistory(false);
  };

  const toggleHistoryPin = (item: AssistantHistoryItem) => {
    if (item.isArchived) return;
    updateHistoryItem(item.id, { isPinned: !item.isPinned });
    setOpenHistoryMenuId(null);
  };

  const openRenameHistory = (item: AssistantHistoryItem) => {
    setRenamingHistoryItem(item);
    setRenameValue(item.title);
    setOpenHistoryMenuId(null);
  };

  const confirmRenameHistory = () => {
    const nextTitle = renameValue.trim();
    if (!renamingHistoryItem || !nextTitle) return;
    updateHistoryItem(renamingHistoryItem.id, { title: nextTitle.slice(0, 30) });
    setRenamingHistoryItem(null);
    setRenameValue('');
  };

  const requestArchiveHistory = (item: AssistantHistoryItem) => {
    setArchiveConfirmItem(item);
    setOpenHistoryMenuId(null);
  };

  const confirmArchiveHistory = () => {
    if (!archiveConfirmItem) return;
    updateHistoryItem(archiveConfirmItem.id, { isArchived: true, isPinned: false });
    setArchiveConfirmItem(null);
  };

  const restoreArchivedHistory = (item: AssistantHistoryItem) => {
    updateHistoryItem(item.id, { isArchived: false, isPinned: false });
    setOpenHistoryMenuId(null);
  };

  const loadHistoryDemo = () => {
    setMessages([
      { id: 'init', role: 'ai', content: '你好！我是你的 AI 私域助手。你可以让我帮你圈选人群，或者创建推送任务。' },
      { id: 'u1', role: 'user', content: '帮我圈选合肥市有学区房需求的用户，预算在 100 万左右。' },
      { id: 'a1', role: 'ai', taskPlan: [{id: '1', text: '意图解析：合肥市+学区房需求', status: 'done'}, {id: '2', text: '计划拆解：提取城市、需求标签', status: 'done'}] },
      { id: 'a2', role: 'ai', content: '已锁定合肥市学区房需求群体，请问预算范围是？' },
      { id: 'u2', role: 'user', content: '100 万以内' },
      { id: 'a2_confirm', role: 'ai', content: audienceConditionsText(['目标对象：C端用户','城市：合肥市','需求：学区房','预算：100万以内']) },
      { id: 'u2_confirm', role: 'user', content: '确认' },
      { id: 'a3', role: 'ai', content: audiencePreviewText, card: { type: 'audience', name: '合肥100w学区房', count: 1285, updateCycle: 'once', samples: ['张三', '李四', '王五'], confirmed: true } },
      { id: 'u3', role: 'user', content: '确认创建' },
      { id: 'a4', role: 'ai', progress: 100 },
      { id: 'a5', role: 'ai', content: '人群包‘合肥100w学区房’已创建完成。', actionButton: { label: '查看详情', tabName: '[AI] 合肥100w学区房' } },
      { id: 'u4', role: 'user', content: '每天中午 11:30，私聊发送【限时特惠】合肥政务区学区房最新名单已出，点击查看...，发送人选择 C 端客服。' },
      { id: 'a6', role: 'ai', content: '已为您生成推送内容预览，请确认内容是否正确？', card: { type: 'content_preview', title: '素材预览', content: '【限时特惠】合肥政务区学区房最新名单已出，点击查看...' } },
      { id: 'u5', role: 'user', content: '没问题' },
      { id: 'a7', role: 'ai', card: { type: 'config', senders: ['C端客服'], blacklists: [], confirmed: true } },
      { id: 'u6', role: 'user', content: '确认配置' },
      { id: 'a7_summary_msg', role: 'ai', content: '请确认最终任务信息：' },
      { id: 'a7_summary', role: 'ai', card: {
        type: 'task_summary',
        taskName: '每日私聊推送_学区房名单',
        channel: '企微私聊',
        pushTime: '每日 11:30',
        pushInterval: '每天',
        recipient: '合肥100w学区房 (1,285人)',
        sender: 'C端客服',
        content: '【限时特惠】合肥政务区学区房最新名单已出，点击查看...',
        confirmed: true
      } },
      { id: 'u6_exec', role: 'user', content: '确认执行任务' },
      { id: 'a8', role: 'ai', progress: 30 },
      { id: 'u7', role: 'user', content: '停一下' },
      { id: 'a9', role: 'ai', content: '任务已锁定，无法中止。' },
      { id: 'a10', role: 'ai', progress: 100 },
      { id: 'a11', role: 'ai', content: '推送任务已排期成功！\n\n任务名称：每日私聊推送_学区房名单\n预估覆盖：1,285 人\n发送内容：【限时特惠】合肥政务区学区房最新名单已出...\n发送人：C端客服\n黑名单过滤：未设置\n执行时间：每日 11:30', actionButton: { label: '查看详情', tabName: '[AI] 每日私聊推送_学区房名单' } },
      { id: 'u8', role: 'user', content: '基于刚才圈选出的合肥100w学区房群，做一次新房测评的群聊推送' },
      { id: 'a12', role: 'ai', content: '好的，正在为您配置群聊推送任务。\n\n已为您生成推送内容预览，请确认内容是否正确？', card: { type: 'content_preview', title: '素材预览', content: '🏢江核低密洋房+四代宅\n🚇双地铁+金陵中学分校\n💥实用率最高可达109%\n💰现在单价2万多就能入手\n👉详细测评已出炉，点击查看[淘房小程序]' } },
      { id: 'u9', role: 'user', content: '没问题，确认执行' },
      { id: 'a13', role: 'ai', content: '群聊推送任务已排期成功！\n\n任务名称：0331-全群-映象星潮\n接收群：南京AI控制台验证群\n发送内容：文本 + 淘房小程序\n发送人：365房博士好好\n执行时间：即时推送', actionButton: { label: '查看详情', tabName: '[AI] 群推送_映象星潮' } }
    ]);
    setBubbles([
      { id: 'b1', type: 'audience', text: '人群包(1)', items: [{ id: 'i1', name: '合肥100w学区房', tabName: '[AI] 合肥100w学区房' }] },
      { id: 'b3', type: 'group', text: '群聊包(1)', items: [{ id: 'i3', name: '合肥100w学区房群', tabName: '[AI] 合肥100w学区房群' }] },
      { id: 'b2', type: 'task', text: '推送任务(2)', items: [
        { id: 'i2', name: '每日私聊推送_学区房名单', tabName: '[AI] 每日私聊推送_学区房名单' },
        { id: 'i4', name: '0331-全群-映象星潮', tabName: '[AI] 群推送_映象星潮' }
      ] }
    ]);
    upsertAudienceResourcesFromItems([{ id: 'i1', name: '合肥100w学区房', tabName: '[AI] 合肥100w学区房' }]);
    upsertGroupResourcesFromItems([{ id: 'i3', name: '合肥100w学区房群', tabName: '[AI] 合肥100w学区房群' }]);
    upsertPushTaskResourcesFromItems([
      { id: 'i2', name: '每日私聊推送_学区房名单', tabName: '[AI] 每日私聊推送_学区房名单' },
      { id: 'i4', name: '0331-全群-映象星潮', tabName: '[AI] 群推送_映象星潮' }
    ]);
    setResourceView('task');
    setResourceSearch('');
    setSelectedResourceId('i2');
    setRenamingResource(null);
    setMode('执行模式');
    setShowHistory(false);
  };

  const slideOverBase = slideOverUser?.replace(/^群内客户-/, '');
  const slideOverIndex = slideOverBase ? slideOverList.indexOf(slideOverBase) : -1;
  const hasSlideOverPrev = slideOverIndex > 0;
  const hasSlideOverNext = slideOverIndex !== -1 && slideOverIndex < slideOverList.length - 1;
  const activeSelectionGroup = selectionGroupByName(slideOverBase);
  const displayTitle = slideOverUser;
  const slideOverProfile = activationUserProfile(displayTitle || '');
  const handleSlideOverPrev = () => { if (hasSlideOverPrev) setSlideOverUser(slideOverList[slideOverIndex - 1]); };
  const handleSlideOverNext = () => { if (hasSlideOverNext) setSlideOverUser(slideOverList[slideOverIndex + 1]); };

  const visibleAudienceResources = audienceResources.filter(resource => resource.status === '已生成');
  const visibleGroupResources = groupResources.filter(resource => resource.status === '已生成');
  const visiblePushTaskResources = pushTaskResources.filter(resource => resource.id.startsWith('DEMO-T-') || resource.status === '待执行' || resource.status === '执行中' || resource.status === '已完成');
  const searchKeyword = resourceSearch.trim().toLowerCase();
  const sortByUpdatedOrder = <T extends { updatedOrder: number },>(resources: T[]) => [...resources].sort((a, b) => b.updatedOrder - a.updatedOrder);
  const filteredAudienceResources = sortByUpdatedOrder(visibleAudienceResources.filter(resource => resource.name.toLowerCase().includes(searchKeyword)));
  const filteredGroupResources = sortByUpdatedOrder(visibleGroupResources.filter(resource => resource.name.toLowerCase().includes(searchKeyword)));
  const filteredPushTaskResources = sortByUpdatedOrder(visiblePushTaskResources.filter(resource => resource.name.toLowerCase().includes(searchKeyword)));

  const renderResourceManager = () => {
    const isAudienceView = resourceView === 'audience';
    const isGroupView = resourceView === 'group';
    const list = isAudienceView ? filteredAudienceResources : isGroupView ? filteredGroupResources : filteredPushTaskResources;
    const emptyText = isAudienceView ? '暂无人群包' : isGroupView ? '暂无群聊包' : '暂无推送任务';
    const searchPlaceholder = isAudienceView ? '请搜索人群包名称' : isGroupView ? '请搜索群聊包名称' : '请搜索推送任务名称';

    return (
      <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f8fa] dark:bg-zinc-950">
        <div className="px-4 pt-3 pb-2 bg-[#f7f8fa] dark:bg-zinc-950 shrink-0">
          <div className="relative">
            <Search size={17} className="absolute left-4 top-3.5 text-[#aeb7c3]" />
            <input
              value={resourceSearch}
              onChange={(e) => setResourceSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-12 pl-11 pr-4 rounded-lg border border-[#edf0f4] bg-white dark:bg-zinc-900 text-sm text-[#1f2d3d] dark:text-zinc-100 placeholder:text-[#aeb7c3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f8fff]/20 focus:border-[#1f8fff]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
          {list.length === 0 ? (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center text-[#9aa6b2]">
              {isAudienceView || isGroupView ? <Users size={30} strokeWidth={1.5} /> : <Zap size={30} strokeWidth={1.5} />}
              <div className="mt-3 text-sm font-medium">{emptyText}</div>
              <div className="mt-1 text-xs">可通过 AI 对话创建后在这里管理</div>
            </div>
          ) : (
            <div className="space-y-3">
              {isAudienceView ? (
                filteredAudienceResources.map(resource => (
                  <div
                    key={resource.id}
                    onClick={() => setSelectedResourceId(resource.id)}
                    className={`rounded-xl border border-[#edf0f4] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden cursor-pointer transition-all ${selectedResourceId === resource.id ? 'ring-1 ring-[#1f8fff]/40 border-[#b8dcff]' : 'hover:border-[#dce5ef] hover:shadow-md'}`}
                  >
                    <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {renamingResource?.type === 'audience' && renamingResource.id === resource.id ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                value={resourceRenameValue}
                                onChange={(e) => {
                                  setResourceRenameValue(e.target.value);
                                  setResourceRenameError('');
                                }}
                                className="min-w-0 flex-1 h-9 px-2 rounded-md border border-[#1f8fff] bg-white dark:bg-zinc-950 text-sm font-semibold text-[#1f2d3d] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#1f8fff]/15"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button onClick={(e) => { e.stopPropagation(); confirmRenameResource(); }} disabled={!resourceRenameValue.trim()} className="w-8 h-8 rounded-full text-[#1f8fff] hover:bg-[#eef7ff] disabled:opacity-40 flex items-center justify-center" title="确认重命名"><Check size={16} /></button>
                              <button onClick={(e) => { e.stopPropagation(); setRenamingResource(null); setResourceRenameError(''); }} className="w-8 h-8 rounded-full text-[#6f7d8c] hover:bg-[#f2f4f7] flex items-center justify-center" title="取消重命名"><X size={16} /></button>
                            </div>
                            {resourceRenameError && <div className="text-[11px] text-red-500">{resourceRenameError}</div>}
                          </div>
                        ) : (
                          <div className="text-base font-semibold text-[#1f2d3d] dark:text-zinc-100 truncate">{resource.name}</div>
                        )}
                        <div className="mt-2 text-xs text-[#a1abb6]">创建 {resource.createdAt} · 关联任务 {resource.relatedTaskCount}</div>
                      </div>
                      <div className="shrink-0 pt-0.5 text-sm text-[#7d8794]">{resource.audienceCount.toLocaleString()}人</div>
                    </div>
                    <div className="grid grid-cols-4 border-t border-[#edf0f4] text-sm font-medium">
                      <button onClick={(e) => { e.stopPropagation(); onOpenTab(resource.tabName, `[AI] ${resource.name}`); onClose(); }} className="h-10 text-[#1f8fff] hover:bg-[#f5fbff] border-r border-[#edf0f4]">查看</button>
                      <button onClick={(e) => { e.stopPropagation(); openRenameResource('audience', resource.id, resource.name); }} className="h-10 text-[#5f6875] hover:bg-[#f8fafc] border-r border-[#edf0f4]">重命名</button>
                      <button onClick={(e) => { e.stopPropagation(); copyAudienceConditions(resource); }} className="h-10 text-[#5f6875] hover:bg-[#f8fafc] border-r border-[#edf0f4]">复制条件</button>
                      <button onClick={(e) => { e.stopPropagation(); useAudienceForPush(resource); }} className="h-10 text-[#22b36a] hover:bg-[#f3fbf7]">用于推送</button>
                    </div>
                  </div>
                ))
              ) : isGroupView ? (
                filteredGroupResources.map(resource => (
                  <div
                    key={resource.id}
                    onClick={() => setSelectedResourceId(resource.id)}
                    className={`rounded-xl border border-[#edf0f4] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden cursor-pointer transition-all ${selectedResourceId === resource.id ? 'ring-1 ring-[#1f8fff]/40 border-[#b8dcff]' : 'hover:border-[#dce5ef] hover:shadow-md'}`}
                  >
                    <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {renamingResource?.type === 'group' && renamingResource.id === resource.id ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                value={resourceRenameValue}
                                onChange={(e) => {
                                  setResourceRenameValue(e.target.value);
                                  setResourceRenameError('');
                                }}
                                className="min-w-0 flex-1 h-9 px-2 rounded-md border border-[#1f8fff] bg-white dark:bg-zinc-950 text-sm font-semibold text-[#1f2d3d] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#1f8fff]/15"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button onClick={(e) => { e.stopPropagation(); confirmRenameResource(); }} disabled={!resourceRenameValue.trim()} className="w-8 h-8 rounded-full text-[#1f8fff] hover:bg-[#eef7ff] disabled:opacity-40 flex items-center justify-center" title="确认重命名"><Check size={16} /></button>
                              <button onClick={(e) => { e.stopPropagation(); setRenamingResource(null); setResourceRenameError(''); }} className="w-8 h-8 rounded-full text-[#6f7d8c] hover:bg-[#f2f4f7] flex items-center justify-center" title="取消重命名"><X size={16} /></button>
                            </div>
                            {resourceRenameError && <div className="text-[11px] text-red-500">{resourceRenameError}</div>}
                          </div>
                        ) : (
                          <div className="text-base font-semibold text-[#1f2d3d] dark:text-zinc-100 truncate">{resource.name}</div>
                        )}
                        <div className="mt-2 text-xs text-[#a1abb6]">创建 {resource.createdAt} · 关联任务 {resource.relatedTaskCount}</div>
                      </div>
                      <div className="shrink-0 pt-0.5 text-sm text-[#7d8794]">{resource.groupCount}个群</div>
                    </div>
                    <div className="grid grid-cols-4 border-t border-[#edf0f4] text-sm font-medium">
                      <button onClick={(e) => { e.stopPropagation(); onOpenTab(resource.tabName, `[AI] ${resource.name}`); onClose(); }} className="h-10 text-[#1f8fff] hover:bg-[#f5fbff] border-r border-[#edf0f4]">查看</button>
                      <button onClick={(e) => { e.stopPropagation(); openRenameResource('group', resource.id, resource.name); }} className="h-10 text-[#5f6875] hover:bg-[#f8fafc] border-r border-[#edf0f4]">重命名</button>
                      <button onClick={(e) => { e.stopPropagation(); copyGroupConditions(resource); }} className="h-10 text-[#5f6875] hover:bg-[#f8fafc] border-r border-[#edf0f4]">复制条件</button>
                      <button onClick={(e) => { e.stopPropagation(); useGroupForPush(resource); }} className="h-10 text-[#22b36a] hover:bg-[#f3fbf7]">用于推送</button>
                    </div>
                  </div>
                ))
              ) : (
                filteredPushTaskResources.map(resource => {
                  return (
                    <div
                      key={resource.id}
                      onClick={() => setSelectedResourceId(resource.id)}
                      className={`rounded-xl border border-[#edf0f4] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden cursor-pointer transition-all ${selectedResourceId === resource.id ? 'ring-1 ring-[#1f8fff]/40 border-[#b8dcff]' : 'hover:border-[#dce5ef] hover:shadow-md'}`}
                    >
                      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {renamingResource?.type === 'task' && renamingResource.id === resource.id ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <input
                                  value={resourceRenameValue}
                                  onChange={(e) => {
                                    setResourceRenameValue(e.target.value);
                                    setResourceRenameError('');
                                  }}
                                  className="min-w-0 flex-1 h-9 px-2 rounded-md border border-[#1f8fff] bg-white dark:bg-zinc-950 text-sm font-semibold text-[#1f2d3d] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#1f8fff]/15"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button onClick={(e) => { e.stopPropagation(); confirmRenameResource(); }} disabled={!resourceRenameValue.trim()} className="w-8 h-8 rounded-full text-[#1f8fff] hover:bg-[#eef7ff] disabled:opacity-40 flex items-center justify-center" title="确认重命名"><Check size={16} /></button>
                                <button onClick={(e) => { e.stopPropagation(); setRenamingResource(null); setResourceRenameError(''); }} className="w-8 h-8 rounded-full text-[#6f7d8c] hover:bg-[#f2f4f7] flex items-center justify-center" title="取消重命名"><X size={16} /></button>
                              </div>
                              {resourceRenameError && <div className="text-[11px] text-red-500">{resourceRenameError}</div>}
                            </div>
                          ) : (
                          <div className="text-base font-semibold text-[#1f2d3d] dark:text-zinc-100 truncate">{resource.name}</div>
                          )}
                          <div className="mt-2 text-xs text-[#5f6875]">{resource.relatedAudienceName} | {resource.estimatedReach.toLocaleString()}人</div>
                          <div className="mt-1 text-xs text-[#a1abb6]">推送 {resource.pushTime} · 创建 {resource.createdAt}</div>
                        </div>
                        <span className="shrink-0 rounded-md bg-[#eaf2ff] px-2 py-1 text-[11px] font-medium text-[#1f8fff]">{resource.pushType}</span>
                      </div>
                      <div className="grid grid-cols-2 border-t border-[#edf0f4] text-sm font-medium">
                        <button onClick={(e) => { e.stopPropagation(); onOpenTab(resource.tabName, resource.name); onClose(); }} className="h-10 text-[#1f8fff] hover:bg-[#f5fbff] border-r border-[#edf0f4]">查看</button>
                        <button onClick={(e) => { e.stopPropagation(); openRenameResource('task', resource.id, resource.name); }} className="h-10 text-[#5f6875] hover:bg-[#f8fafc]">重命名</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="h-[58px] border-b border-[#e9edf2] dark:border-zinc-800 flex items-center justify-between px-5 shrink-0 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-2 font-semibold text-[#1f2d3d] dark:text-zinc-100 min-w-0">
          <span className="w-5 h-5 rounded-md bg-[#eef7ff] text-[#1f8fff] flex items-center justify-center shrink-0">
            <Bot size={15} />
          </span>
          <span className="text-[15px]">365AI私域助手</span>
          <button onClick={handleNewChat} className="h-6 px-2 rounded-full border border-[#d8eaff] bg-[#f4f9ff] text-[#1f8fff] hover:bg-[#eaf5ff] text-xs font-medium flex items-center gap-1 shrink-0" title="新建对话">
            <span>+ 新对话</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-md flex items-center justify-center text-[#8b96a3] hover:bg-[#f4f6f8]" title="自动化任务" aria-label="自动化任务" data-testid="reach-automation-entry" onClick={()=>{stopDemo();onOpenTab('[自动化任务]','自动化任务');onClose();}}><Workflow size={17}/></button>
          <button
            data-testid="assistant-resource-toggle"
            onClick={() => setResourceView(resourceView === 'chat' ? 'audience' : 'chat')}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              resourceView === 'chat'
                ? 'text-[#8b96a3] hover:bg-[#f4f6f8] dark:hover:bg-zinc-800'
                : 'bg-[#eef7ff] text-[#1f8fff]'
            }`}
            title="资料"
          >
            <FolderOpen size={17} />
          </button>
          <button onClick={openHistoryPanel} className="w-8 h-8 rounded-md hover:bg-[#f4f6f8] dark:hover:bg-zinc-800 text-[#8b96a3] flex items-center justify-center" title="历史对话">
            <History size={16} />
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-[#f4f6f8] dark:hover:bg-zinc-800 text-[#8b96a3] flex items-center justify-center" title="关闭">
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Resource Tabs */}
      {resourceView !== 'chat' && (
      <div className="px-4 py-3 border-b border-[#edf0f4] dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
        <div className="grid grid-cols-3 rounded-lg bg-[#f0f0f0] dark:bg-zinc-800 p-1">
          {[
            { key: 'audience' as const, label: '人群包', count: visibleAudienceResources.length, icon: <Users size={15} /> },
            { key: 'group' as const, label: '群聊包', count: visibleGroupResources.length, icon: <MessageSquare size={15} /> },
            { key: 'task' as const, label: '推送任务', count: visiblePushTaskResources.length, icon: <Zap size={15} /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setResourceView(tab.key);
                setResourceSearch('');
                setRenamingResource(null);
              }}
              className={`h-10 rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                resourceView === tab.key
                  ? 'bg-white dark:bg-zinc-700 text-[#1f8fff] dark:text-blue-300 shadow-sm'
                  : 'text-[#5f6875] dark:text-zinc-400 hover:text-[#1f2d3d] dark:hover:text-zinc-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}({tab.count})</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Chat Area */}
      {resourceView === 'chat' ? (
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-xs font-medium text-zinc-500">快速体验</div>
            {isPlaying && (
              <button onClick={stopDemo} className="text-[11px] text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                <Square size={11} fill="currentColor" />
                停止
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={()=>{handleNewChat();setMode('圈选模式');setInputValue('/人群圈选 圈选西安已付费经纪人')}} data-testid="b-reach-example" className="h-8 flex items-center justify-center gap-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-950 text-indigo-600 border border-indigo-100 hover:bg-indigo-50"><Users size={12}/>圈选人群包（小B示例）</button>
            <button
              onClick={() => isPlaying && currentScenario === 1 ? stopDemo() : startDemo(1)}
              className={`h-8 flex items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors ${isPlaying && currentScenario === 1 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white dark:bg-zinc-950 text-indigo-600 border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
            >
              <Play size={12} />
              圈选人群包
            </button>
            <button
              onClick={() => {
                stopDemo();
                setResourceView('chat');
                setSlideOverUser(null);
                setMessages([
                  { id: 'group-preview-request', role: 'user', content: '圈选合肥市预算100—200万、有学区房需求的交付群，每日更新。' },
                  { id: 'group-preview-demo', role: 'ai', content: '群聊预览：点击样例查看群档案、用户档案、用户记忆与用户行为。以下为交互演示数据。', card: { type: 'group_package', name: '合肥100w学区房群', count: 1001, updateCycle: 'day', samples: selectionGroupSamples.map(group => group.key) } },
                  { id: 'group-package-demo', role: 'ai', content: '查看已有演示群聊包，可从列表打开同一套详情。', actionButton: { label: '查看演示群聊包', tabName: '[AI] 合肥100w学区房群' } }
                ]);
              }}
              className="h-8 flex items-center justify-center gap-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-950 text-indigo-600 border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <MessageSquare size={12} />
              圈选群聊包
            </button>
            <button
              onClick={() => isPlaying && currentScenario === 2 ? stopDemo() : startDemo(2)}
              className={`h-8 flex items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors ${isPlaying && currentScenario === 2 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white dark:bg-zinc-950 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
            >
              <Play size={12} />
              创建推送任务
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 space-y-2" data-testid="activation-examples">
          <div className="text-xs text-blue-600">主动激活策略示例</div>
          <div className="grid grid-cols-2 gap-2">{activationCategories.map(c=><button key={c.id} className="text-xs border border-blue-100 bg-white rounded p-2 text-blue-600" onClick={()=>{stopDemo();setMode('执行模式');if(!currentActivationAudiences().length)syncBubbleItems('audience',initialAudienceResources.filter(a=>['i1','aud-global-3'].includes(a.id)));setInputValue(`对 @合肥100w学区房，使用主动激活策略「${c.name}」，每天11:30由C端客服企微私聊。`);}}><span className="block text-[10px] text-blue-400 mb-0.5">主动激活</span>{c.name}</button>)}</div>
          <p className="text-[11px] text-zinc-400">点击填入示例，再发送；演示不触达真实用户。</p>
        </div>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.images && msg.images.length > 0 && (
                <div className={`flex flex-wrap gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.images.map((img, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 max-w-[200px]">
                      <img src={img} alt="sent" className="w-full h-auto block" />
                    </div>
                  ))}
                </div>
              )}
              {msg.content && (
                <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              )}
              {msg.card?.invalidated && <div className="b-invalidated">条件或配置已更新，请以下方最新确认卡为准。</div>}
              {msg.card && msg.card.type === 'b_step' && !msg.card.invalidated && <BConversationCard key={msg.id} data={msg.card} executionMode={mode==='执行模式'} onAction={(action,value)=>bAction(msg,action,value)} onOpenTask={openReachTask}/>}
              {msg.loading && <div className="w-12 h-9 rounded-2xl rounded-tl-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><Loader2 size={16} className="animate-spin text-indigo-500" /></div>}
              {msg.bPlanFlowId&&<BAgentPlan flowId={msg.bPlanFlowId}/>}
              {msg.taskPlan && <TaskPlan tasks={msg.taskPlan} />}
              {msg.card && msg.card.type === 'audience' && !msg.card.invalidated && <AudienceCard data={msg.card} onUserClick={(u,l)=>{const members=(l||msg.card.samples).map(name=>{if(msg.card.audienceType==='b'){const person=reachState.flows[msg.card.bFlowId]?.rows.find((p:any)=>p.name===name);return person?audienceMember(name,person):null}return audienceMember(name)}).filter(Boolean);const member=members.find((m:any)=>m.name===u);if(member)setAudienceMemberPreview({members,memberId:member.id||member.name})}} onNameChange={name=>setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,card:{...m.card,name,nameError:''} as CardData}:m))} onConfirm={name=>confirmAudience(msg,name)}/>}
            {msg.card && msg.card.type === 'group_package' && <GroupPackageCard data={msg.card} onGroupClick={(u, l) => { setIsAudienceSamplePreview(false); setSlideOverTab('群档案'); setSlideOverUser(u); setSlideOverList(l || []); }} onUserClick={(u, l) => { setIsAudienceSamplePreview(false); setSlideOverTab('记忆'); setSlideOverUser(u); setSlideOverList(l || []); }} onConfirm={(name) => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, card: { ...m.card, name, confirmed: true } as CardData } : m))} />}
              {msg.card && msg.card.type === 'proactive_choice' && <ActivationChoiceCard data={{...msg.card,audiences:currentActivationAudiences()}} onRefresh={draft=>activationRefresh(msg,draft)} onRetry={()=>activationRetry(msg)} onConfirm={()=>activationConfirmed(msg)} onUser={name=>{setIsAudienceSamplePreview(false);setSlideOverUser(name);setSlideOverList([name]);setSlideOverTab('记忆')}}/>}
              {msg.card && msg.card.type === 'config' && <ConfigCard data={msg.card} onConfirm={config => msg.card.proactive ? activationConfigured(msg,config) : markActivationCard(msg.id)} />}
              {msg.card && msg.card.type === 'content_preview' && <ContentPreviewCard data={msg.card} />}
              {msg.card && msg.card.type === 'task_summary' && !msg.card.invalidated && <TaskSummaryCard data={msg.card} onConfirm={(taskName) => msg.card.bFlowId ? bTaskCreated(msg,taskName) : msg.card.proactive ? activationCreated(msg,taskName) : setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, card: { ...m.card, taskName, confirmed: true } as CardData } : m))} />}
              {msg.progress !== undefined && (
                <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    <span>执行进度</span>
                    <span>{msg.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${msg.progress}%` }}
                      transition={{ ease: "linear", duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
              {msg.actionButton && (
                <button
                  onClick={() => {
                    onOpenTab(msg.actionButton!.tabName);
                    onClose();
                  }}
                  className="mt-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  {msg.actionButton.label}
                </button>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      ) : (
        renderResourceManager()
      )}

      <AnimatePresence>
        {resourceToast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-1/2 bottom-24 z-50 -translate-x-1/2 rounded-md bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg"
          >
            {resourceToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      {resourceView === 'chat' && (
      <div className="p-4 pt-0 shrink-0">
        <SmartInput
          mode={mode}
          setMode={setMode}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          sessionAudiences={[...currentActivationAudiences().map(a=>a.name),...reachState.audiences.map(a=>a.name)]}
          sessionAudienceOptions={[...currentActivationAudiences().map(a=>({id:a.id,name:a.name})),...reachState.audiences.map(a=>({id:a.id,name:a.name,label:reachState.audiences.filter(other=>other.name===a.name).length>1?a.name+' · '+a.created:a.name}))]}
          onSelectAudience={id=>{bInputAudienceIds.current=[...new Set([...bInputAudienceIds.current,id])]}}
          bubbles={bubbles}
          onBubbleClick={(tabName) => {
            onOpenTab(tabName);
            onClose();
          }}
          activeBubbleId={activeBubbleId}
          onBubbleToggle={setActiveBubbleId}
          notifyBAvailable={notifyBAvailable}
          locked={inputLocked || bConfigPending}
          lockPlaceholder={bConfigPending ? "请先完成触达配置" : undefined}
          pendingAction={pendingAction}
        />
      </div>
      )}

      {notifyBAvailable&&bModal?.kind==='content'&&<BContentDialog key={bModal.flowId+'content'} flow={reachState.flows[bModal.flowId]} onClose={bCloseContent} onSave={bSaveContent}/>}

      {audienceMemberPreview&&<AudienceMemberDrawer key={audienceMemberPreview.memberId} members={audienceMemberPreview.members} memberId={audienceMemberPreview.memberId} onClose={()=>setAudienceMemberPreview(null)}/>}

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-0 right-0 bottom-0 bg-white dark:bg-zinc-900 z-30 flex flex-col"
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {historyView === 'archived' && (
                  <button
                    onClick={() => {
                      setHistoryView('active');
                      setOpenHistoryMenuId(null);
                    }}
                    className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    title="返回历史对话"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                  {historyView === 'archived' ? '归档对话' : '历史对话'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {historyView === 'active' && (
                  <button
                    onClick={() => {
                      setHistoryView('archived');
                      setOpenHistoryMenuId(null);
                    }}
                    className="px-2 py-1 rounded-md text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                    title="查看归档对话"
                  >
                    <Archive size={14} />
                    归档
                  </button>
                )}
                <button onClick={() => setShowHistory(false)} className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {sortedHistoryItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-zinc-400">
                  {historyView === 'archived' ? '暂无归档对话' : '暂无历史对话'}
                </div>
              ) : (
                sortedHistoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                    onClick={() => handleOpenHistoryItem(item)}
                  >
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</span>
                          {!item.isArchived && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleHistoryPin(item);
                              }}
                              className={`shrink-0 p-0.5 rounded transition-colors ${item.isPinned ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'text-zinc-300 opacity-0 group-hover:opacity-100 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                              title={item.isPinned ? '取消置顶' : '置顶'}
                            >
                              <Pin size={13} className={item.isPinned ? 'fill-current' : ''} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="text-xs text-zinc-500">{item.date}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenHistoryMenuId(openHistoryMenuId === item.id ? null : item.id);
                          }}
                          className="p-1 rounded-md text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all"
                          title="更多"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap pr-8">
                      {item.crowdPackCount > 0 && (
                        <span className="text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">人群包({item.crowdPackCount})</span>
                      )}
                      {item.groupPackCount > 0 && (
                        <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">群聊包({item.groupPackCount})</span>
                      )}
                      {item.pushTaskCount > 0 && (
                        <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">推送任务({item.pushTaskCount})</span>
                      )}
                      {item.crowdPackCount === 0 && item.groupPackCount === 0 && item.pushTaskCount === 0 && (
                        <span className="text-xs text-zinc-400">无关联数据</span>
                      )}
                    </div>
                    {openHistoryMenuId === item.id && (
                      <div
                        className="absolute right-3 top-9 z-40 w-32 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!item.isArchived && (
                          <button
                            onClick={() => toggleHistoryPin(item)}
                            className="w-full px-2 py-1.5 rounded-md text-xs text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                          >
                            <Pin size={13} />
                            {item.isPinned ? '取消置顶' : '置顶'}
                          </button>
                        )}
                        <button
                          onClick={() => openRenameHistory(item)}
                          className="w-full px-2 py-1.5 rounded-md text-xs text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                        >
                          <Pencil size={13} />
                          重命名
                        </button>
                        {item.isArchived ? (
                          <button
                            onClick={() => restoreArchivedHistory(item)}
                            className="w-full px-2 py-1.5 rounded-md text-xs text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2"
                          >
                            <Archive size={13} />
                            取消归档
                          </button>
                        ) : (
                          <button
                            onClick={() => requestArchiveHistory(item)}
                            className="w-full px-2 py-1.5 rounded-md text-xs text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                          >
                            <Archive size={13} />
                            归档
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {renamingHistoryItem && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-[320px] rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">重命名对话</span>
                <button onClick={() => setRenamingHistoryItem(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">
                <input
                  value={renameValue}
                  maxLength={30}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="mt-1 text-right text-[11px] text-zinc-400">{renameValue.trim().length}/30</div>
              </div>
              <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-2">
                <button onClick={() => setRenamingHistoryItem(null)} className="px-3 py-1.5 rounded-md text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  取消
                </button>
                <button
                  onClick={confirmRenameHistory}
                  disabled={!renameValue.trim()}
                  className="px-3 py-1.5 rounded-md text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {archiveConfirmItem && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-[340px] rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">确认归档对话？</span>
                <button onClick={() => setArchiveConfirmItem(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                归档后，该对话将从历史对话列表中移至归档对话，可随时取消归档。已生成的人群包、群聊包和推送任务不会被删除。
              </div>
              <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-2">
                <button onClick={() => setArchiveConfirmItem(null)} className="px-3 py-1.5 rounded-md text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  取消
                </button>
                <button onClick={confirmArchiveHistory} className="px-3 py-1.5 rounded-md text-xs text-white bg-blue-600 hover:bg-blue-700">
                  确认归档
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 预览客户与群聊包共用记忆、档案、行为展示。 */}
      <AnimatePresence>
        {slideOverUser && (
          <motion.aside role="dialog" aria-label={activeSelectionGroup ? '样例群聊详情' : '用户详情'} initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col shadow-xl">
            <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 px-4 shrink-0">
              <button onClick={() => { setSlideOverUser(null); setSlideOverList([]); setIsAudienceSamplePreview(false); window.logEvent('close_profile', { user: slideOverUser }); }} className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"><ChevronLeft size={16} />返回</button>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{activeSelectionGroup ? '群聊详情' : '用户详情'}</span>
              {slideOverList.length > 1 && slideOverIndex !== -1 ? <div className="flex items-center gap-1"><button onClick={handleSlideOverPrev} disabled={!hasSlideOverPrev} title="上一组" aria-label="上一组" className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronLeft size={16} /></button><span className="text-xs text-zinc-500">{slideOverIndex + 1} / {slideOverList.length}</span><button onClick={handleSlideOverNext} disabled={!hasSlideOverNext} title="下一组" aria-label="下一组" className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronRight size={16} /></button></div> : <span />}
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {activeSelectionGroup ? <GroupCustomerInfo group={activeSelectionGroup} tab={slideOverTab} onTabChange={setSlideOverTab} /> : <div className="space-y-6">
                <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                  {isAudienceSamplePreview ? <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-lg font-semibold text-indigo-600 dark:text-indigo-300">{displayTitle?.slice(0,1)}</div><div><div className="text-xs text-zinc-500 mb-1">预览用户信息</div><h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{displayTitle}</h2><div className="text-xs text-zinc-500 mt-1">788ID：{audiencePreviewData[displayTitle || '']?.id || '—'}</div></div></div> : <div className="flex items-center gap-3"><img src={slideOverProfile.avatar} alt={`${slideOverProfile.nickname}头像`} className="w-12 h-12 rounded-full shrink-0"/><div><div className="text-xs text-zinc-500 mb-1">用户昵称</div><h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{slideOverProfile.nickname}</h2><div className="text-xs text-zinc-500 mt-1">788ID：{slideOverProfile.id}</div></div></div>}
                  <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg">{(['记忆', '档案', '行为'] as const).map(tab => <button key={tab} type="button" onClick={() => setSlideOverTab(tab)} className={`flex-1 py-1.5 text-sm font-medium rounded-md ${slideOverTab === tab ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>{tab}</button>)}</div>
                </div>
                {slideOverTab === '记忆' && (isAudienceSamplePreview ? <AudiencePreviewMemoryPanel userName={displayTitle || ''} /> : <ActivationMemoryPanel />)}
                {slideOverTab === '行为' && (isAudienceSamplePreview ? <AudiencePreviewBehaviorPanel userName={displayTitle || ''} /> : <ActivationBehaviorPanel />)}
                {slideOverTab === '档案' && <div>{(isAudienceSamplePreview && audiencePreviewData[displayTitle || ''] ? audiencePreviewData[displayTitle || ''].profile.map(([label,value]: [string,string]) => ({ label, value, tag: '档案', time: '原型演示数据' })) : [
                  { label: '意向价格', value: '200万以内', tag: '固定', time: '2026-03-04 10:18:35' },
                  { label: '意向购房面积/户型', value: '120平左右', tag: '固定', time: '2026-03-04 10:18:35' },
                  { label: '首付预算', value: '60万左右', tag: '固定', time: '2026-03-04 10:18:35' },
                  { label: '购房目的', value: '学区房', tag: '固定', time: '2026-03-04 10:18:35' },
                  { label: '关注区域', value: '政务区、高新区', tag: '固定', time: '2026-03-04 10:18:35' },
                  { label: '决策周期', value: '3个月内', tag: '预测', time: '2026-03-04 10:18:35' }
                ]).map((field, i) => <div key={i} className="flex flex-col py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"><div className="flex items-center justify-between mb-1"><span className="text-sm text-zinc-500">{field.label}</span><span className={`text-[10px] px-1.5 py-0.5 rounded ${field.tag === '固定' || field.tag === '档案' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>{field.tag}</span></div><div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{field.value}</div><div className="text-[10px] text-zinc-400 mt-1">{field.time}</div></div>)}</div>}
              </div>}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- src/App.tsx ---

function App() {
  return <Workspace />;
}

// --- main.tsx entry point ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
