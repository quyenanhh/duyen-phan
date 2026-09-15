const {Button,IconButton,Badge,Tag,Card,Icon,Input,Select,Checkbox,Switch,Textarea,Tabs,Pagination,DataTable,StatusChip,StatCard,Sidebar,Dialog,Toast,Tooltip,EmptyState}=window.DuyNPhNDesignSystem_e06890;

const NAV=[{id:'dash',label:'Tổng quan',icon:'layout-dashboard'},{section:'Vận hành'},
{id:'orders',label:'Đơn hàng',icon:'receipt-text',badge:12},{id:'menu',label:'Thực đơn',icon:'utensils'},{id:'branches',label:'Chi nhánh',icon:'store'},
{section:'Nội bộ'},{id:'staff',label:'Nhân sự',icon:'users'},{id:'finance',label:'Tài chính',icon:'wallet'},{id:'settings',label:'Cài đặt',icon:'settings'}];

function TopBar({title,subtitle,actions}){
  return <div style={{display:'flex',alignItems:'center',gap:24,padding:'0 32px',height:'var(--topbar-h)',background:'var(--surface-card)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:10}}>
    <div style={{flex:1}}>
      <h2 style={{fontSize:'var(--fs-h3)'}}>{title}</h2>
      {subtitle?<div style={{fontSize:'var(--fs-caption)',color:'var(--text-muted)'}}>{subtitle}</div>:null}
    </div>
    <Input size="sm" icon="search" placeholder="Tìm đơn, món, nhân viên…" wrapperStyle={{width:260}}/>
    <Tooltip label="Thông báo"><IconButton icon="bell" label="Thông báo"/></Tooltip>
    {actions}
    <span style={{display:'flex',alignItems:'center',gap:8,paddingLeft:16,borderLeft:'1px solid var(--border-soft)'}}>
      <span style={{width:32,height:32,borderRadius:999,background:'var(--clay-100)',color:'var(--text-accent)',display:'grid',placeItems:'center',fontWeight:600,fontSize:12}}>AN</span>
      <span style={{fontSize:'var(--fs-label)'}}><span style={{display:'block',fontWeight:600}}>An Nguyễn</span><span style={{color:'var(--text-muted)'}}>Quản lý chuỗi</span></span>
    </span>
  </div>;
}
const PAGE={padding:32,display:'flex',flexDirection:'column',gap:24};

function Dashboard(){
  const rows=[{id:1,code:'DP-1042',br:'Quận 3',t:'14:20',total:'385.000₫',st:'delivering'},
  {id:2,code:'DP-1041',br:'Quận 1',t:'13:52',total:'1.250.000₫',st:'completed'},
  {id:3,code:'DP-1040',br:'Tân Bình',t:'13:41',total:'96.000₫',st:'processing'},
  {id:4,code:'DP-1039',br:'Quận 1',t:'13:02',total:'210.000₫',st:'cancelled'},
  {id:5,code:'DP-1038',br:'Thủ Đức',t:'12:47',total:'540.000₫',st:'completed'}];
  return <div style={PAGE}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
      <StatCard icon="wallet" label="Doanh thu hôm nay" value="18.420.000₫" delta="+8,2% so với hôm qua"/>
      <StatCard icon="receipt-text" label="Đơn hàng" value="264" delta="+12 đơn"/>
      <StatCard icon="utensils" label="Phần cơm đã bán" value="1.086" delta="+3,4%"/>
      <StatCard icon="clock" label="Đơn trễ" value="3" delta="+2 so với hôm qua" deltaTone="danger"/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:24}}>
      <Card title="Doanh thu 7 ngày" subtitle="Tất cả chi nhánh · 25/08 – 31/08/2026" actions={<Select size="sm" options={['7 ngày','30 ngày']}/>}>
        <div style={{display:'flex',alignItems:'flex-end',gap:16,height:180,paddingTop:8}}>
          {[[62,'25/08'],[71,'26/08'],[58,'27/08'],[80,'28/08'],[96,'29/08'],[88,'30/08'],[74,'31/08']].map(([h,d],i)=>
            <div key={d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
              <div style={{width:'100%',height:h+'%',borderRadius:'8px 8px 4px 4px',background:i===6?'var(--brand)':'var(--green-300)'}}/>
              <span style={{fontSize:'var(--fs-caption)',color:'var(--text-muted)'}}>{d}</span></div>)}
        </div>
      </Card>
      <Card title="Chi nhánh hôm nay" subtitle="Theo doanh thu">
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {[['Quận 3 — Võ Văn Tần','5.240.000₫',92],['Quận 1 — Lê Lợi','4.180.000₫',74],['Tân Bình — Hoàng Việt','3.020.000₫',54],['Thủ Đức — Kha Vạn Cân','2.480.000₫',44]].map(([n,v,p])=>
            <div key={n}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--fs-body-sm)'}}><span>{n}</span><span style={{fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{v}</span></div>
              <div style={{marginTop:6,height:6,borderRadius:999,background:'var(--surface-sunken)'}}><div style={{width:p+'%',height:'100%',borderRadius:999,background:'var(--accent)'}}/></div>
            </div>)}
        </div>
      </Card>
    </div>
    <Card title="Đơn hàng gần đây" actions={<Button size="sm" variant="secondary" iconRight="arrow-right">Xem tất cả</Button>} padding={0}
      style={{paddingTop:0}}>
      <DataTable onRowClick={()=>{}} columns={[{key:'code',label:'Mã đơn'},{key:'br',label:'Chi nhánh'},{key:'t',label:'Giờ',muted:true},{key:'total',label:'Tổng tiền',align:'right'},{key:'st',label:'Trạng thái',render:r=><StatusChip status={r.st}/>}]} rows={rows}/>
    </Card>
  </div>;
}

const ORDERS=[{id:1,code:'DP-1042',cus:'Trần Mỹ Linh',br:'Quận 3',items:'3 phần cơm, 1 canh',t:'14:20 31/08/2026',total:'385.000₫',st:'delivering'},
{id:2,code:'DP-1041',cus:'Công ty Lá Xanh',br:'Quận 1',items:'25 phần cơm hộp',t:'13:52 31/08/2026',total:'1.250.000₫',st:'completed'},
{id:3,code:'DP-1040',cus:'Nguyễn Văn Hải',br:'Tân Bình',items:'1 cơm sen, 1 chè',t:'13:41 31/08/2026',total:'96.000₫',st:'processing'},
{id:4,code:'DP-1039',cus:'Lê Thu Hà',br:'Quận 1',items:'2 phần cơm phần',t:'13:02 31/08/2026',total:'210.000₫',st:'cancelled'},
{id:5,code:'DP-1038',cus:'Phạm Quốc Anh',br:'Thủ Đức',items:'8 phần cơm chay',t:'12:47 31/08/2026',total:'540.000₫',st:'completed'},
{id:6,code:'DP-1037',cus:'Đặng Bảo Châu',br:'Quận 3',items:'1 gỏi cuốn, 1 canh',t:'12:20 31/08/2026',total:'87.000₫',st:'late'}];

function Orders({onToast}){
  const [tab,setTab]=React.useState('all');
  const [sel,setSel]=React.useState([]);
  const [cancel,setCancel]=React.useState(null);
  const rows=tab==='all'?ORDERS:ORDERS.filter(o=>tab==='proc'?['processing','pending'].includes(o.st):tab==='deliv'?o.st==='delivering':o.st==='late');
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  return <div style={PAGE}>
    <Card padding={0}>
      <div style={{padding:'20px 24px 0',display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
        <Select size="sm" options={['Tất cả chi nhánh','Quận 1 — Lê Lợi','Quận 3 — Võ Văn Tần','Tân Bình','Thủ Đức']} wrapperStyle={{width:220}}/>
        <Input size="sm" icon="calendar-days" defaultValue="31/08/2026" wrapperStyle={{width:160}}/>
        <Input size="sm" icon="search" placeholder="Mã đơn hoặc tên khách" wrapperStyle={{width:240}}/>
        <span style={{flex:1}}/>
        {sel.length?<><span style={{fontSize:'var(--fs-label)',color:'var(--text-muted)'}}>Đã chọn {sel.length}</span>
          <Button size="sm" variant="secondary" icon="printer">In hoá đơn</Button></>:null}
        <Tooltip label="Xuất Excel"><IconButton icon="download" label="Xuất Excel" size="sm" variant="outline"/></Tooltip>
        <Button size="sm" icon="plus">Tạo đơn</Button>
      </div>
      <div style={{padding:'16px 24px 0'}}>
        <Tabs value={tab} onChange={setTab} items={[{id:'all',label:'Tất cả',count:264},{id:'proc',label:'Đang xử lý',count:9},{id:'deliv',label:'Đang giao',count:4},{id:'late',label:'Trễ',count:3}]}/>
      </div>
      {rows.length?<DataTable onRowClick={()=>{}} rows={rows} columns={[
        {key:'sel',label:<Checkbox indeterminate={sel.length>0&&sel.length<rows.length} checked={sel.length===rows.length} onChange={v=>setSel(v?rows.map(r=>r.id):[])}/>,width:44,
          render:r=><Checkbox checked={sel.includes(r.id)} onChange={()=>toggle(r.id)}/>},
        {key:'code',label:'Mã đơn',render:r=><span style={{fontWeight:600}}>{r.code}</span>},
        {key:'cus',label:'Khách hàng',render:r=><span><span style={{display:'block'}}>{r.cus}</span><span style={{fontSize:'var(--fs-caption)',color:'var(--text-muted)'}}>{r.items}</span></span>},
        {key:'br',label:'Chi nhánh',sortable:true},{key:'t',label:'Thời gian',muted:true},
        {key:'total',label:'Tổng tiền',align:'right'},
        {key:'st',label:'Trạng thái',render:r=><StatusChip status={r.st}/>},
        {key:'act',label:'',align:'right',render:r=><span style={{display:'flex',gap:4,justifyContent:'flex-end'}}>
          <IconButton icon="pencil" label="Sửa đơn" size="sm"/>
          <IconButton icon="x" label="Huỷ đơn" size="sm" onClick={e=>{e.stopPropagation();setCancel(r)}}/></span>}
      ]}/>:<EmptyState icon="receipt-text" title="Không có đơn nào ở trạng thái này" description="Thử đổi bộ lọc hoặc chọn ngày khác." action={<Button variant="secondary" onClick={()=>setTab('all')}>Xem tất cả đơn</Button>}/>}
      <Pagination page={1} pageCount={12} total={264} onChange={()=>{}}/>
    </Card>
    {cancel?<Dialog title={'Huỷ đơn '+cancel.code+'?'} description="Đơn đã huỷ không thể hoàn tác. Khách sẽ nhận thông báo qua SMS." onClose={()=>setCancel(null)}
      footer={<><Button variant="secondary" onClick={()=>setCancel(null)}>Giữ đơn</Button><Button variant="danger" onClick={()=>{setCancel(null);onToast({tone:'danger',title:'Đã huỷ đơn '+cancel.code,description:'Chi nhánh '+cancel.br+' · 14:32 31/08/2026'})}}>Huỷ đơn</Button></>}>
      <Textarea label="Lý do huỷ" rows={2} placeholder="Khách đổi ý, hết món…"/>
    </Dialog>:null}
  </div>;
}

function MenuAdmin({onToast}){
  const [dishes,setDishes]=React.useState([
    {id:1,n:'Cơm chay thập cẩm',c:'Cơm phần',p:'65.000₫',on:true,st:'open'},
    {id:2,n:'Cơm sen hạt dẻ',c:'Cơm phần',p:'78.000₫',on:true,st:'open'},
    {id:3,n:'Canh nấm rong biển',c:'Canh & rau',p:'45.000₫',on:true,st:'open'},
    {id:4,n:'Đậu hũ sốt tiêu xanh',c:'Món chính',p:'58.000₫',on:false,st:'draft'},
    {id:5,n:'Gỏi cuốn chay',c:'Món cuốn',p:'42.000₫',on:true,st:'open'},
    {id:6,n:'Chè hạt sen long nhãn',c:'Tráng miệng',p:'32.000₫',on:true,st:'open'}]);
  const [cat,setCat]=React.useState('Tất cả');
  const toggle=id=>{setDishes(d=>d.map(x=>x.id===id?{...x,on:!x.on}:x));onToast({tone:'success',title:'Đã cập nhật thực đơn',description:'Chi nhánh Quận 3 · 14:20 31/08/2026'})};
  const cats=['Tất cả','Cơm phần','Món chính','Canh & rau','Món cuốn','Tráng miệng'];
  const rows=cat==='Tất cả'?dishes:dishes.filter(d=>d.c===cat);
  return <div style={PAGE}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24,alignItems:'start'}}>
      <Card padding={0}>
        <div style={{padding:'20px 24px 0',display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          {cats.map(c=><Tag key={c} selected={cat===c} onClick={()=>setCat(c)}>{c}</Tag>)}
          <span style={{flex:1}}/><Button size="sm" icon="plus">Thêm món</Button>
        </div>
        <div style={{paddingTop:16}}>
          <DataTable rows={rows} columns={[
            {key:'n',label:'Món',render:r=><span style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{width:36,height:36,borderRadius:8,background:'var(--surface-accent-soft)',color:'var(--accent)',display:'grid',placeItems:'center'}}><Icon name="utensils" size={16}/></span>
              <span><span style={{display:'block',fontWeight:600}}>{r.n}</span><span style={{fontSize:'var(--fs-caption)',color:'var(--text-muted)'}}>{r.c}</span></span></span>},
            {key:'p',label:'Giá bán',align:'right'},
            {key:'st',label:'Trạng thái',render:r=><StatusChip status={r.on?'open':'draft'} label={r.on?'Đang bán':'Nháp'}/>},
            {key:'on',label:'Hiển thị',align:'right',render:r=><Switch checked={r.on} onChange={()=>toggle(r.id)}/>}]}/>
        </div>
        <Pagination page={1} pageCount={4} total={48}/>
      </Card>
      <Card title="Món trong ngày" subtitle="31/08/2026 · Quận 3">
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Input label="Tên món" defaultValue="Cơm chay thập cẩm" icon="utensils"/>
          <Select label="Nhóm món" options={cats.slice(1)}/>
          <Input label="Giá bán" defaultValue="65.000" suffix="₫"/>
          <Input label="Số phần nấu hôm nay" defaultValue="120" hint="Nấu vừa đủ, hạn chế dư."/>
          <Textarea label="Mô tả" rows={3} defaultValue="Gạo lứt, đậu hũ áp chảo, rau củ hấp theo mùa."/>
          <Checkbox label="Cho phép giao hàng" checked onChange={()=>{}}/>
          <div style={{display:'flex',gap:8}}><Button fullWidth onClick={()=>onToast({tone:'success',title:'Đã lưu món',description:'Cơm chay thập cẩm · 65.000₫'})}>Lưu món</Button><Button variant="secondary">Huỷ</Button></div>
        </div>
      </Card>
    </div>
  </div>;
}

function Staff(){
  const rows=[{id:1,n:'An Nguyễn',r:'Quản lý chuỗi',br:'Trụ sở',sh:'Hành chính',st:'open',p:'0901 234 567'},
  {id:2,n:'Trần Văn Bình',r:'Bếp trưởng',br:'Quận 3',sh:'Sáng 06:00–14:00',st:'open',p:'0902 345 678'},
  {id:3,n:'Lê Thị Cúc',r:'Phục vụ',br:'Quận 1',sh:'Chiều 14:00–22:00',st:'processing',p:'0903 456 789'},
  {id:4,n:'Phạm Minh Dũng',r:'Giao hàng',br:'Tân Bình',sh:'Sáng 09:00–17:00',st:'delivering',p:'0904 567 890'},
  {id:5,n:'Võ Thu Hằng',r:'Thu ngân',br:'Thủ Đức',sh:'Nghỉ phép',st:'draft',p:'0905 678 901'}];
  return <div style={PAGE}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
      <StatCard icon="users" label="Nhân sự đang làm" value="186" delta="+4 tháng này"/>
      <StatCard icon="calendar-days" label="Ca hôm nay" value="42/45" delta="3 ca chưa xếp" deltaTone="warning"/>
      <StatCard icon="wallet" label="Quỹ lương tháng 8" value="1.284.000.000₫"/>
    </div>
    <Card title="Danh sách nhân viên" subtitle="Tất cả chi nhánh" actions={<span style={{display:'flex',gap:8}}><Button size="sm" variant="secondary" icon="upload">Nhập CSV</Button><Button size="sm" icon="user-plus">Thêm nhân viên</Button></span>} padding={0} style={{paddingTop:0}}>
      <DataTable rows={rows} onRowClick={()=>{}} columns={[
        {key:'n',label:'Nhân viên',render:r=><span style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:32,height:32,borderRadius:999,background:'var(--surface-brand-soft)',color:'var(--success-text)',display:'grid',placeItems:'center',fontWeight:600,fontSize:12}}>{r.n.split(' ').map(w=>w[0]).slice(0,2).join('')}</span>
          <span><span style={{display:'block',fontWeight:600}}>{r.n}</span><span style={{fontSize:'var(--fs-caption)',color:'var(--text-muted)'}}>{r.p}</span></span></span>},
        {key:'r',label:'Vai trò'},{key:'br',label:'Chi nhánh',sortable:true},{key:'sh',label:'Ca làm',muted:true},
        {key:'st',label:'Trạng thái',render:r=><StatusChip status={r.st} label={{open:'Đang làm',processing:'Đang ca',delivering:'Trên đường',draft:'Nghỉ phép'}[r.st]}/>},
        {key:'act',label:'',align:'right',render:()=><IconButton icon="ellipsis" label="Tuỳ chọn" size="sm"/>}]}/>
      <Pagination page={1} pageCount={19} total={186}/>
    </Card>
  </div>;
}

function Placeholder({title}){
  return <div style={PAGE}><Card padding={0}><EmptyState icon="hard-hat" title={title+' — chưa có thiết kế'} description="Phần này chưa được cung cấp trong tài liệu thương hiệu, nên UI kit để trống thay vì tự nghĩ ra." /></Card></div>;
}

function AdminApp(){
  const [logged,setLogged]=React.useState(false);
  const [view,setView]=React.useState('dash');
  const [toast,setToast]=React.useState(null);
  const onToast=t=>{setToast(t);setTimeout(()=>setToast(null),3200)};
  if(!logged) return <LoginScreen onLogin={()=>setLogged(true)}/>;
  const titles={dash:['Tổng quan','Cập nhật 14:32 · 31/08/2026'],orders:['Đơn hàng','264 đơn hôm nay · 12 chi nhánh'],menu:['Thực đơn','48 món · 6 nhóm'],staff:['Nhân sự','186 nhân viên'],branches:['Chi nhánh','12 chi nhánh'],finance:['Tài chính','Kỳ 08/2026'],settings:['Cài đặt','']};
  const [t,s]=titles[view]||['',''];
  return <div style={{display:'flex',minHeight:'100vh',alignItems:'stretch'}}>
    <Sidebar items={NAV} active={view} onSelect={setView} style={{position:'sticky',top:0,height:'100vh'}}
      footer={<div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{width:28,height:28,borderRadius:999,background:'var(--clay-100)',color:'var(--text-accent)',display:'grid',placeItems:'center',fontWeight:600,fontSize:11}}>AN</span>
        <span style={{flex:1,fontSize:'var(--fs-label)'}}>An Nguyễn</span>
        <IconButton icon="log-out" label="Đăng xuất" size="sm" onClick={()=>setLogged(false)}/></div>}/>
    <div style={{flex:1,minWidth:0}}>
      <TopBar title={t} subtitle={s} actions={view==='orders'?<Button icon="plus">Tạo đơn</Button>:null}/>
      {view==='dash'?<Dashboard/>:view==='orders'?<Orders onToast={onToast}/>:view==='menu'?<MenuAdmin onToast={onToast}/>:view==='staff'?<Staff/>:<Placeholder title={t}/>}
    </div>
    {toast?<div style={{position:'fixed',right:24,bottom:24,zIndex:60}}><Toast {...toast} onClose={()=>setToast(null)}/></div>:null}
  </div>;
}

function LoginScreen({onLogin}){
  return <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr'}}>
    <div style={{background:'var(--surface-inverse)',color:'var(--cream-50)',padding:'56px 64px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div style={{fontSize:24,fontWeight:600,letterSpacing:'var(--ls-tight)'}}>Duyên Phần</div>
      <div>
        <div style={{fontSize:'var(--fs-caption)',letterSpacing:'var(--ls-caps)',textTransform:'uppercase',color:'var(--clay-300)',fontWeight:600}}>Hệ thống quản trị chuỗi</div>
        <h1 style={{fontSize:38,marginTop:14,color:'var(--cream-50)',fontWeight:600,lineHeight:1.25,letterSpacing:'var(--ls-tight)'}}>Điều hành 12 chi nhánh<br/>trên một màn hình</h1>
        <p style={{marginTop:14,color:'var(--green-300)',maxWidth:380}}>Thực đơn, đơn hàng, nhân sự và tài chính — cập nhật theo thời gian thực.</p>
      </div>
      <div style={{fontSize:'var(--fs-caption)',color:'var(--green-300)'}}>Nội bộ · v2.4 · Hỗ trợ IT: 1900 6088 ext. 2</div>
    </div>
    <div style={{display:'grid',placeItems:'center',padding:32}}>
      <Card style={{width:'100%',maxWidth:400}}>
        <h2 style={{fontSize:'var(--fs-h2)'}}>Đăng nhập</h2>
        <p style={{marginTop:6,fontSize:'var(--fs-body-sm)',color:'var(--text-muted)'}}>Dùng email nội bộ @duyenphan.vn</p>
        <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:24}}>
          <Input label="Email" defaultValue="an.nguyen@duyenphan.vn" icon="mail"/>
          <Input label="Mật khẩu" type="password" defaultValue="••••••••" icon="lock"/>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Checkbox label="Ghi nhớ đăng nhập" checked onChange={()=>{}}/>
            <a href="#" onClick={e=>e.preventDefault()} style={{fontSize:'var(--fs-label)'}}>Quên mật khẩu?</a>
          </div>
          <Button fullWidth size="lg" onClick={onLogin}>Đăng nhập</Button>
        </div>
      </Card>
    </div>
  </div>;
}
Object.assign(window,{AdminApp,LoginScreen,Dashboard,Orders,MenuAdmin,Staff,TopBar,NAV});
