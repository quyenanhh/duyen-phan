The admin workhorse — branch, order, staff and finance lists.

```jsx
<DataTable
  columns={[{key:'code',label:'Mã đơn'},{key:'total',label:'Tổng',align:'right'},{key:'st',label:'Trạng thái',render:r=><StatusChip status={r.st}/>}]}
  rows={rows} onRowClick={openOrder} />
```
Right-align money and use tabular numerals; format as `1.250.000₫`.
