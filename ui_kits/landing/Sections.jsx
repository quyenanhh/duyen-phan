const {Button,Badge,Tag,Card,Icon,Input}=window.DuyNPhNDesignSystem_e06890;

const WRAP={maxWidth:'var(--page-max)',margin:'0 auto',padding:'0 32px'};
const CAPS={fontSize:'var(--fs-caption)',letterSpacing:'var(--ls-caps)',textTransform:'uppercase',fontWeight:'var(--fw-semibold)',color:'var(--text-accent)'};

function Photo({label,h=240,tone='clay',style}){
  return <div style={{height:h,borderRadius:'var(--radius-card)',background:tone==='green'?'var(--surface-brand-soft)':'var(--surface-accent-soft)',
    border:'1px dashed var(--clay-300)',display:'grid',placeItems:'center',color:'var(--text-accent)',fontSize:'var(--fs-label)',gap:6,...style}}>
    <span style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}><Icon name="image" size={20}/>{label}</span></div>;
}

function Nav({page,onNav}){
  const links=[['menu','Thực đơn'],['story','Câu chuyện'],['branch','Chi nhánh'],['contact','Liên hệ']];
  return <header style={{position:'sticky',top:0,zIndex:20,background:'rgba(250,247,242,.88)',backdropFilter:'blur(8px)',borderBottom:'1px solid var(--border)'}}>
    <div style={{...WRAP,height:72,display:'flex',alignItems:'center',gap:32}}>
      <a href="#" onClick={e=>{e.preventDefault();onNav('home')}} style={{fontFamily:'var(--font-serif)',fontSize:22,fontWeight:600,color:'var(--text-brand)',textDecoration:'none'}}>Duyên Phần</a>
      <nav style={{display:'flex',gap:28,flex:1,fontSize:'var(--fs-body-sm)'}}>
        {links.map(([id,l])=><a key={id} href={'#'+id} onClick={e=>{e.preventDefault();onNav(id)}}
          style={{color:page===id?'var(--text-brand)':'var(--text-muted)',fontWeight:page===id?600:400,textDecoration:'none'}}>{l}</a>)}
      </nav>
      <span style={{display:'flex',alignItems:'center',gap:12}}>
        <span style={{display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-label)',color:'var(--text-muted)'}}><Icon name="phone" size={15}/>1900 6088</span>
        <Button variant="accent" icon="calendar-days">Đặt bàn</Button>
      </span>
    </div>
  </header>;
}

function Hero(){
  return <section style={{...WRAP,paddingTop:72,paddingBottom:72,display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
    <div>
      <span style={CAPS}>Cơm chay thuần Việt · từ 2016</span>
      <h1 style={{fontFamily:'var(--font-serif)',fontSize:52,lineHeight:1.15,marginTop:16,fontWeight:600}}>Một bữa cơm lành,<br/><em style={{color:'var(--text-accent)'}}>nấu bằng sự tử tế</em></h1>
      <p style={{marginTop:20,fontSize:'var(--fs-body-lg)',color:'var(--text-muted)',maxWidth:460,textWrap:'pretty'}}>
        Rau củ theo mùa, gạo lứt và đậu hũ làm mỗi sáng. Chúng tôi nấu vừa đủ cho một ngày, không phô trương, không dư thừa.</p>
      <div style={{display:'flex',gap:12,marginTop:32}}>
        <Button size="lg" icon="utensils">Xem thực đơn hôm nay</Button>
        <Button size="lg" variant="secondary" icon="map-pin">Tìm chi nhánh</Button>
      </div>
      <div style={{display:'flex',gap:32,marginTop:40,paddingTop:24,borderTop:'1px solid var(--border)'}}>
        {[['12','chi nhánh'],['48','món theo mùa'],['9 năm','nấu chay mỗi ngày']].map(([n,l])=>
          <span key={l}><span style={{display:'block',fontSize:24,fontWeight:600}}>{n}</span><span style={{fontSize:'var(--fs-label)',color:'var(--text-muted)'}}>{l}</span></span>)}
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <Photo label="Ảnh mâm cơm chay" h={300} style={{gridColumn:'1 / -1'}}/>
      <Photo label="Ảnh bếp" h={160} tone="green"/>
      <Photo label="Ảnh rau củ" h={160}/>
    </div>
  </section>;
}

function MenuSection(){
  const cats=['Tất cả','Cơm phần','Món chính','Canh & rau','Món cuốn','Tráng miệng'];
  const [cat,setCat]=React.useState('Tất cả');
  const dishes=[
    {n:'Cơm chay thập cẩm',d:'Gạo lứt, đậu hũ áp chảo, rau củ hấp',p:'65.000₫',tag:'Món ngày'},
    {n:'Canh nấm rong biển',d:'Nấm hương, rong biển, cà rốt',p:'45.000₫'},
    {n:'Đậu hũ sốt tiêu xanh',d:'Đậu hũ non, tiêu xanh Phú Quốc',p:'58.000₫',tag:'Món mới'},
    {n:'Gỏi cuốn chay',d:'Bún tươi, nấm, rau thơm · 4 cuốn',p:'42.000₫'},
    {n:'Cơm sen hạt dẻ',d:'Gạo sen, hạt dẻ rang, lá sen hấp',p:'78.000₫'},
    {n:'Chè hạt sen long nhãn',d:'Sen Đồng Tháp, long nhãn Hưng Yên',p:'32.000₫'}];
  return <section id="menu" style={{background:'var(--surface-card)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'80px 0'}}>
    <div style={WRAP}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
        <div><span style={CAPS}>Thực đơn</span>
          <h2 style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:12,fontWeight:600}}>Nấu theo mùa, đổi theo ngày</h2></div>
        <a href="#" onClick={e=>e.preventDefault()} style={{fontSize:'var(--fs-body-sm)',fontWeight:500}}>Tải thực đơn tuần (PDF)</a>
      </div>
      <div style={{display:'flex',gap:8,marginTop:28,flexWrap:'wrap'}}>{cats.map(c=><Tag key={c} selected={cat===c} onClick={()=>setCat(c)}>{c}</Tag>)}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,marginTop:28}}>
        {dishes.map(d=><Card key={d.n} hoverable padding={0}>
          <Photo label="Ảnh món" h={168}/>
          <div style={{padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'flex-start'}}>
              <h3 style={{fontSize:'var(--fs-h3)'}}>{d.n}</h3>
              {d.tag?<Badge tone="accent">{d.tag}</Badge>:null}
            </div>
            <p style={{marginTop:6,fontSize:'var(--fs-body-sm)',color:'var(--text-muted)'}}>{d.d}</p>
            <div style={{marginTop:16,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{d.p}</span>
              <Button size="sm" variant="ghost" iconRight="arrow-right">Chi tiết</Button>
            </div>
          </div></Card>)}
      </div>
    </div>
  </section>;
}

function StorySection(){
  return <section id="story" style={{...WRAP,padding:'80px 32px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
    <Photo label="Ảnh người nấu" h={380} tone="green"/>
    <div>
      <span style={CAPS}>Câu chuyện</span>
      <h2 style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:12,fontWeight:600}}>Duyên phần — cái duyên của một bữa cơm</h2>
      <p style={{marginTop:16,fontSize:'var(--fs-body-lg)',color:'var(--text-muted)',textWrap:'pretty'}}>
        Bắt đầu từ một quán nhỏ ở Quận 3 năm 2016, chúng tôi vẫn giữ một nguyên tắc: nấu đủ ăn trong ngày, không để thừa.</p>
      <div style={{display:'grid',gap:20,marginTop:32}}>
        {[['sprout','Rau củ theo mùa','Đặt hàng trực tiếp từ nông trại Đà Lạt và Long Khánh.'],
          ['soup','Nấu vừa đủ','Mỗi bếp nấu theo số phần đã đặt, hạn chế thức ăn dư.'],
          ['heart-handshake','Giá phải chăng','Cơm phần từ 45.000₫, phần chay miễn phí mỗi rằm.']].map(([i,t,d])=>
          <div key={t} style={{display:'flex',gap:14}}>
            <span style={{width:40,height:40,flex:'0 0 auto',borderRadius:'var(--radius-control)',background:'var(--surface-brand-soft)',color:'var(--brand)',display:'grid',placeItems:'center'}}><Icon name={i} size={20}/></span>
            <span><span style={{display:'block',fontWeight:600}}>{t}</span><span style={{fontSize:'var(--fs-body-sm)',color:'var(--text-muted)'}}>{d}</span></span>
          </div>)}
      </div>
    </div>
  </section>;
}

function BranchSection(){
  const br=[{n:'Quận 3 — Võ Văn Tần',h:'10:00 – 21:00',s:'Đang mở'},{n:'Quận 1 — Lê Lợi',h:'10:00 – 22:00',s:'Đang mở'},{n:'Tân Bình — Hoàng Việt',h:'10:00 – 20:30',s:'Sắp đóng'},{n:'Thủ Đức — Kha Vạn Cân',h:'10:00 – 21:00',s:'Đang mở'}];
  return <section id="branch" style={{background:'var(--surface-inverse)',color:'var(--cream-50)',padding:'80px 0'}}>
    <div style={WRAP}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64}}>
        <div>
          <span style={{...CAPS,color:'var(--clay-300)'}}>Chi nhánh</span>
          <h2 style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:12,color:'var(--cream-50)',fontWeight:600}}>12 chi nhánh tại TP.HCM và Hà Nội</h2>
          <p style={{marginTop:16,color:'var(--green-300)',fontSize:'var(--fs-body-lg)'}}>Giao trong bán kính 5km. Đặt trước 11:00 để nhận cơm trưa đúng giờ.</p>
          <div style={{display:'flex',gap:10,marginTop:28,maxWidth:420}}>
            <Input placeholder="Nhập địa chỉ của bạn" icon="map-pin" wrapperStyle={{flex:1}}/>
            <Button variant="accent">Tìm</Button>
          </div>
        </div>
        <div style={{display:'grid',gap:12}}>
          {br.map(b=><div key={b.n} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'16px 20px',borderRadius:'var(--radius-card)',background:'rgba(255,253,250,.06)',border:'1px solid rgba(255,253,250,.12)'}}>
            <span><span style={{display:'block',fontWeight:600}}>{b.n}</span><span style={{fontSize:'var(--fs-label)',color:'var(--green-300)'}}>{b.h}</span></span>
            <Badge tone={b.s==='Đang mở'?'brand':'warning'} dot>{b.s}</Badge>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}

function Footer(){
  return <footer id="contact" style={{borderTop:'1px solid var(--border)',padding:'56px 0 32px'}}>
    <div style={{...WRAP,display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1.4fr',gap:40}}>
      <div>
        <div style={{fontFamily:'var(--font-serif)',fontSize:22,fontWeight:600,color:'var(--text-brand)'}}>Duyên Phần</div>
        <p style={{marginTop:10,fontSize:'var(--fs-body-sm)',color:'var(--text-muted)',maxWidth:260}}>Chuỗi nhà hàng cơm chay thuần Việt. Nấu vừa đủ, ăn vừa lành.</p>
      </div>
      {[['Thực đơn',['Cơm phần','Món chính','Canh & rau','Tráng miệng']],['Về chúng tôi',['Câu chuyện','Tuyển dụng','Nhượng quyền','Liên hệ']]].map(([t,ls])=>
        <div key={t}><div style={{fontSize:'var(--fs-label)',fontWeight:600,marginBottom:12}}>{t}</div>
          <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:'var(--fs-body-sm)'}}>{ls.map(l=><a key={l} href="#" onClick={e=>e.preventDefault()} style={{color:'var(--text-muted)'}}>{l}</a>)}</div></div>)}
      <div>
        <div style={{fontSize:'var(--fs-label)',fontWeight:600,marginBottom:12}}>Nhận thực đơn tuần</div>
        <div style={{display:'flex',gap:8}}><Input placeholder="Email của bạn" wrapperStyle={{flex:1}}/><Button>Gửi</Button></div>
        <p style={{marginTop:10,fontSize:'var(--fs-caption)',color:'var(--text-subtle)'}}>Mỗi thứ Hai, một email. Huỷ bất cứ lúc nào.</p>
      </div>
    </div>
    <div style={{...WRAP,marginTop:40,paddingTop:20,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',fontSize:'var(--fs-caption)',color:'var(--text-subtle)'}}>
      <span>© 2026 Duyên Phần. Giấy phép ĐKKD 0312xxxxxx.</span><span>1900 6088 · xinchao@duyenphan.vn</span>
    </div>
  </footer>;
}

function LandingPage(){
  const [page,setPage]=React.useState('home');
  const onNav=id=>{setPage(id);const el=document.getElementById(id);if(el)window.scrollTo({top:el.offsetTop-72,behavior:'smooth'});};
  return <div><Nav page={page} onNav={onNav}/><Hero/><MenuSection/><StorySection/><BranchSection/><Footer/></div>;
}
Object.assign(window,{LandingPage,Nav,Hero,MenuSection,StorySection,BranchSection,Footer,Photo});
