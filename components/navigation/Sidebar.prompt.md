Admin shell navigation — always paired with a right-hand content area.

```jsx
<Sidebar active="orders" onSelect={setView} items={[
  {id:'dash',label:'Tổng quan',icon:'layout-dashboard'},
  {section:'Vận hành'},
  {id:'orders',label:'Đơn hàng',icon:'receipt-text',badge:12},
]} />
```
