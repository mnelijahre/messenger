

  


  /*=====================================================*/
  
  var initLoad = true;
  var lastSeenKey = null;
  pageHeader.innerHTML = "Welcome " + localStorage.getItem("user");

  const contentInput = document.querySelector("#contentInput");
  const contentSubmitButton = document.querySelector("#contentSubmitButton");
  const form = document.getElementById("myForm");
  
  function handleForm(event) { event.preventDefault(); } 
  form.addEventListener('submit', handleForm);

  var numCurTexts = 0;

  function contentSubmit(){
      var data = contentInput.value;
      var x;
      get(child(dbref, 'counter')).then((snapshot) =>{
          if (!snapshot.exists()){
              set(ref(db, 'counter'),{
                  val: 0
              })
              return 0
          }else{
              set(ref(db, 'counter'),{
                  val: snapshot.val().val + 1
              })
          }
          return snapshot.val().val + 1 //this is bad but it works
          
      }).then(async(x)=>{ //slight fix could be implemented here to make it lag less
          numCurTexts = x,
          await update(ref(db, 'texts'), {
              [x]: contentInput.value
          })
          contentInput.value = ""
      })

      myRefresh();
  }

  contentSubmitButton.addEventListener('click', contentSubmit);


  function getNumCurTexts(){
      return get(child(dbref, 'counter')).then((snapshot)=>{
          if (!snapshot.exists()){
              set(ref(db, 'counter'),{
                  val: 0
              })
              return 0
          }
          return snapshot.val().val
      })
  }



  async function myRefresh(){
      const snapshot = await get(child(dbref, "texts"));

      onValue(child(dbref, "texts"), (snapshot) => {
      snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();

          if(lastSeenKey == null || parseInt(childKey) > parseInt(lastSeenKey)){                    
                  lastSeenKey = childKey;
                  const div = document.createElement("div");
                  const datumName = document.createElement("b");
                  const datumContent = document.createElement("p");
                  div.classList.add("dataRow")
                  div.appendChild(datumName);
                  div.appendChild(datumContent);
                  datumName.innerHTML = localStorage.getItem("user");
                  datumContent.innerHTML = childData;
                  
                  contentHolder.appendChild(div);
              
          
          }
      });
  });
  }
  

  myRefresh();