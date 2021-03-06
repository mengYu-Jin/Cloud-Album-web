$(document).ready(()=>{
    const ids=new Array()
    let imgs=null
    new Promise((resolve,reject)=>{
        $.ajax({
            url:"http://localhost:5000/api/photo",
            type:"GET",
            headers:{
                Authorization:localStorage.getItem('token')
            },
            dataType:'JSON',
            success:(data)=>{
                resolve(data)
            }
        })
    }).then(value=>{
        const ul=document.getElementById("imgs")
        ul.innerHTML="";
        imgs=value.target
        imgs.map(img=>{
            if(img.deletephoto){
                if(img.favorite){
                    const li=document.createElement("li");
                    li.innerHTML=`
                        <div id="${img.id}" class="img" style="background: url(${img.url});background-size: cover;background-position: center center;"></div>
                        <div class="yuan">
                            <span class="iconfont icon-yuanquan"></span>
                        </div>
                        <div class="favo">
                            <span class="iconfont icon-aixin1" style="color:#ff3838"></span>
                        </div>
                        <div class="type">
                            <p>${img.type}</p>
                            <p>${img.date}</p>
                        </div>
                    `;
                    ul.appendChild(li);
                }else{
                    const li=document.createElement("li");
                    li.innerHTML=`
                        <div id="${img.id}" class="img" style="background: url(${img.url});background-size: cover;background-position: center center;"></div>
                        <div class="yuan">
                            <span class="iconfont icon-yuanquan"></span>
                        </div>
                        <div class="favo">
                            <span class="iconfont icon-aixin"></span>
                        </div>
                        <div class="type">
                            <p>${img.type}</p>
                            <p>${img.date}</p>
                        </div>
                    `;
                    ul.appendChild(li);
                }
            } 
        })
    }).then(value=>{
        // ?????????????????????????????????
        let count;
        // ???????????????????????????????????????
        const lis=Array.from(document.getElementById("imgs").getElementsByTagName("li"));
        const length=lis.length;
        lis.map((li,index)=>li.getElementsByClassName("img")[0].addEventListener('click',function(e){
            count=index;
            const url=e.target.style.background.split('"')[1].split('"')[0];
            const bigImg=document.getElementById("bigImg");
            const container=bigImg.getElementsByClassName("container");
            const img=document.createElement("img");
            img.src=`${url}`;
            container[0].appendChild(img);
            bigImg.style.display="block";
        }));

        // ???????????????????????????
        const pre=document.getElementById("pre");
        pre.addEventListener('click',function(){
            if(count==0) ;
            else{
                count--;
                const url=lis[count].children[0].style.background.split('"')[1].split('"')[0];
                const bigImg=document.getElementById("bigImg");
                const container=bigImg.getElementsByClassName("container");
                const img=container[0].lastElementChild;
                img.src=`${url}`;
            }
        })
        const next=document.getElementById("next");
        next.addEventListener('click',function(){
            if(count==length-1) ;
            else{
                count++;
                const url=lis[count].children[0].style.background.split('"')[1].split('"')[0];
                const bigImg=document.getElementById("bigImg");
                const container=bigImg.getElementsByClassName("container");
                const img=container[0].lastElementChild;
                img.src=`${url}`;
            }
        })

        // ?????????????????????
        const closes=Array.from(document.querySelectorAll(".icon-guanbi"));
        const bigImg=document.getElementById("bigImg");
        closes.map(close=>close.addEventListener('click',function(){
            const container=bigImg.getElementsByClassName("container");
            const removeImg=container[0].lastElementChild;
            container[0].removeChild(removeImg);
            bigImg.style.display="none";
        }))
    }).then(value=>{
        const lis=Array.from(document.getElementById("imgs").getElementsByTagName("li"));
        lis.map(li=>{
            li.children[1].children[0].addEventListener('click',(e)=>{
                if(e.target.classList.contains('icon-yuanquan')){
                    ids.push(e.target.parentNode.parentNode.firstElementChild.id);
                    e.target.classList.remove('icon-yuanquan');
                    e.target.classList.add('icon-xuanzhong');
                    e.target.style.color="rgba(255, 255, 255,0.9)";
                }else{
                    const index = ids.indexOf(e.target.parentNode.parentNode.firstElementChild.id); //??????index()??????????????????????????????
                    if (index > -1) {
                        ids.splice(index, 1); //??????splice()???????????????????????????splice() ???????????????????????????????????????????????????
                    }
                    e.target.style.color="rgba(255, 255, 255,0.5)";
                    e.target.classList.remove('icon-xuanzhong');
                    e.target.classList.add('icon-yuanquan');
                }
            })
            li.children[2].children[0].addEventListener('click',(e)=>{
                if(e.target.classList.contains('icon-aixin')){
                    $.ajax({
                        url:"http://localhost:5000/api/photo?favorite=true",
                        type:"PUT",
                        headers:{
                            Authorization:localStorage.getItem('token')
                        },
                        data:{ids:[li.children[0].id]},
                        dataType:'JSON',
                        success:(data)=>{
                            console.log(data)
                        }
                    })
                    e.target.classList.remove('icon-aixin');
                    e.target.classList.add('icon-aixin1');
                    e.target.style.color="#ff3838";
                }else{
                    $.ajax({
                        url:"http://localhost:5000/api/photo?favorite=false",
                        type:"PUT",
                        data:{ids:[li.children[0].id]},
                        headers:{
                            Authorization:localStorage.getItem('token')
                        },
                        dataType:'JSON',
                        success:(data)=>{
                            console.log(data)
                        }
                    })
                    e.target.style.color="rgba(255, 255, 255,0.5)" ;
                    e.target.classList.remove('icon-aixin1');
                    e.target.classList.add('icon-aixin');
                }
            })
        })
    }).then(value=>{
        $("#favorite").click(()=>{
            $.ajax({
                url:"http://localhost:5000/api/photo?favorite=true",
                type:"PUT",
                data:{ids:ids},
                headers:{
                    Authorization:localStorage.getItem('token')
                },
                dataType:'JSON',
                success:(data)=>{
                    location.reload();
                    console.log(data)
                }
            })
        })
        $("#bin").click(()=>{
            $.ajax({
                url:"http://localhost:5000/api/photo/delete?ever=true",
                type:"POST",
                data:{ids:ids},
                headers:{
                    Authorization:localStorage.getItem('token')
                },
                dataType:'JSON',
                success:(data)=>{
                    location.reload();
                    console.log(data)
                },
                error: (error)=>{
                    console.log(error);
                }
            })
        })
        $("#vedio").click(()=>{
            const name=prompt("????????????????????????")
            if(name){
                 $.ajax({
                    url:`http://localhost:5000/api/photo/makeVedio?name=${name}`,
                    type:"POST",
                    data:{ids:ids},
                    headers:{
                        Authorization:localStorage.getItem('token')
                    },
                    dataType:'JSON',
                    success:(data)=>{
                        location.reload();
                        console.log(data)
                    },
                    error: (error)=>{
                        console.log(error);
                    }
                })
            }
        })
    }).then(value=>{
        // ??????
        const searchImg=document.getElementById("searchImg");
        searchImg.addEventListener('keyup',(e)=>{
            if(e.keyCode==13){
                const searchText=searchImg.value;
                const searchResult=imgs.filter(img=>{
                    if(img.type==searchText&&img.deletephoto) return img;
                })
                const ul=document.getElementById("imgs")
                ul.innerHTML="";
                searchResult.map(img=>{
                    if(img.favorite){
                        const li=document.createElement("li");
                        li.innerHTML=`
                            <div id="${img.id}" class="img" style="background: url(${img.url});background-size: cover;background-position: center center;"></div>
                            <div class="yuan">
                                <span class="iconfont icon-yuanquan"></span>
                            </div>
                            <div class="favo">
                                <span class="iconfont icon-aixin1" style="color:#ff3838"></span>
                            </div>
                            <div class="type">
                                <p>${img.type}</p>
                                <p>${img.date}</p>
                            </div>
                        `;
                        ul.appendChild(li);
                    }else{
                        const li=document.createElement("li");
                        li.innerHTML=`
                            <div id="${img.id}" class="img" style="background: url(${img.url});background-size: cover;background-position: center center;"></div>
                            <div class="yuan">
                                <span class="iconfont icon-yuanquan"></span>
                            </div>
                            <div class="favo">
                                <span class="iconfont icon-aixin"></span>
                            </div>
                            <div class="type">
                                <p>${img.type}</p>
                                <p>${img.date}</p>
                            </div>
                        `;
                        ul.appendChild(li);
                    }
                });
            }
        });
    }).then(value=>{
        const fileList = new Array()
        $("#upload").change(function(){
            let el = $("#upload").get(0).files[0]
            console.log(el);
            let formdata = new FormData()
            formdata.append("image",el)
            $.ajax ({
                type : "post",
                url : "http://localhost:5000/api/photo/",
                data : formdata,
                contentType : false,
                processData : false,
                headers:{
                    Authorization:localStorage.getItem('token')
                },
                dataType : 'json',
                success : function (data) {
                    location.reload();
                    alert(data.message)
                    console.log(data)
                }
            });
        });
    })
    
})