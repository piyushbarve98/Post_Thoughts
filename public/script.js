let delBtn = document.querySelectorAll('.del-btn');
let btn = '';

for(btn of delBtn){
  let name = btn.parentElement.parentElement.childNodes[3].textContent;
  btn.addEventListener('click',(e)=>{
  
  console.log(typeof name);
  fetch('/del-thoughts',{
    method: 'delete',
    headers:  { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name
    })
  }).then(res => {
      if (res.ok) return res.json()
    }).then((data)=>{
    window.location.reload(true);
  });
});
}




