const inputPregunta= document.getElementById('inputPregunta');
const bPreguntar= document.getElementById('bPreguntar');
const textPregunta= document.getElementById('textPregunta');
const textPromedio= document.getElementById('textPromedio');
const bEliminar= document.getElementById('bEliminar');
const preguntaHistorialCont= document.getElementById('preguntaHistorialCont');

//Database
const database= firebase.database();

let id, Id,Pre,Pun,Per,Pro;
var arrayDef=[];
let totalPromedio=0;



////////////////Evento para crear una pregunta nueva
bPreguntar.addEventListener('click', ()=>{

    let referencia= database.ref('preguntas/'+ 'actual').push();

    if(inputPregunta.value==null){
        alert('Debe ingresar una pregunta');
        return;
    }

    //creo el objeto pregunta
    objetoPregunta={
        pregunta:inputPregunta.value,
        puntaje:0,
        promedio:0,
        totalPersonas:0
    }

    //antes de enviar la uiltima pregunta realizada por el usuario a firebase, hago dos pasos: 
    //primero cambio la unica pregunta de la rama "actual" a la rama de historial
    //Despues de pasarla, creo la pregunta actual, y elimino de esa rama la pregunta que mande a historial

    //Cambio la pregunta de rama
    database.ref('preguntas/'+'actual').once('value',
    function(data){
        data.forEach(

            pregunta=>{
                let valor= pregunta.val();
                id=pregunta.key;

                //cambio la pregunta de rama
                if(pregunta!=null){
                    database.ref('preguntas/'+'historial/'+pregunta.key).set(valor);    
                } 
            });        
    });

    //creo la nueva pregunta en la rama "actual"
    referencia.set(objetoPregunta).then(
        ()=>{
            //despues de que llegue la ultima pregunta, borro la anterior a ella
            eliminarActual(id);
        }
    );

});


/////////////metodo que permite hacer el calculo del pocentraje de la pregunta actual
calculoPromedio=(idP,preDef,p,Totalp,vp)=>{
   
    let referencia= database.ref('preguntas/'+'actual/'+idP);
  
    //Calculo el promedio
    if(Totalp!==0){
        vp=p/Totalp;
    }
 
    //modifico los valores en firebase
   if(vp!=null){
        referencia.set(
            {
              pregunta:preDef,
              puntaje:p,
              promedio:vp,
              totalPersonas:Totalp,
    
            }
        );
    }
}


///////////referencio la rama "actual" para pintar la pregunta
//llamo los datos de la pregunta que estan en firebase
database.ref('preguntas/'+ 'actual').on('value',
function (data){
    
 data.forEach(
        pregunta=>{

            let valor= pregunta.val(); 
            Id=pregunta.key;
            Pre=valor.pregunta;
            Pun=valor.puntaje;
            Per=valor.totalPersonas;
            Pro=valor.pro;
            textPregunta.innerHTML=valor.pregunta;
            textPromedio.innerHTML=valor.promedio; 

            //metodo para calcular el pormedio de calificaciones
            calculoPromedio(pregunta.key,valor.pregunta,valor.puntaje,valor.totalPersonas,valor.promedio);

        });
});



////////elimino la pregunta de la rama "actual"
eliminarActual=(idAct)=>{
    database.ref('preguntas/'+ 'actual/'+idAct).set(null);
}




////////////////Cargo las preguntas del historial
//Llamo los datos de las preguntas de la rama historial para meterlos en componentes
database.ref('preguntas/'+ 'historial').on('value',
function (data){
 
    preguntaHistorialCont.innerHTML=' ';

    data.forEach(
        pregunta=>{

            let valor= pregunta.val();
            let lista= new ListaPreguntaHistorial(valor, pregunta.key);
            preguntaHistorialCont.appendChild(lista.render());
             
        });
});





////////////////Elimina la pregunta actual con el boton de cerrar, y lo mando al historial
bEliminar.addEventListener('click', ()=>{
  //Cambio la pregunta de rama
  database.ref('preguntas/'+'actual').once('value',
  function(data){
      data.forEach(

          pregunta=>{
              let valor= pregunta.val();

              //cambio la pregunta de rama
              if(pregunta!=null){
                  database.ref('preguntas/'+'historial/'+pregunta.key).set(valor);    
              }
              
              eliminarActual(pregunta.key);

              //cambio el texto de la pregunta mientras esta vacio
              textPregunta.innerHTML='Cargando pregunta actual....';
                textPromedio.innerHTML='Cargando promedio...';
    
          });        
  });

})









