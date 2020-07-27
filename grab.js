const fso=new ActiveXObject(Scripting.FileSystemObject);const f=fso.createtextfile(`C:\a.txt`,2,true); 
const props=document.getElementsByClassName("J_TSaleProp");
[].forEach.call(props,(prop)=>{
    types=prop.getElementsByTagName("a");
    if(types.length>1){
        [].forEach.call(types,(type)=>{
            type.click();
            f.writeline(document.getElementById("J_PromoPrice").querySelector(".tm-price").innerHTML);
        })
    }
})
f.close();