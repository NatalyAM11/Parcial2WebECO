class ListaPreguntaHistorial{

    constructor(pregunta, key){
        this.pregunta=pregunta;
        this.key=key;
    }


render=()=>{


    let component= document.createElement('div');
    component.className='listaPreguntaH';

    let textPreguntaCont=document.createElement('div');
    textPreguntaCont.className='textP';
    textPreguntaCont.innerHTML=(this.pregunta.pregunta);

    let textPromedioCont=document.createElement('div');
    textPromedioCont.className='textPro'
    textPromedioCont.innerHTML=(this.pregunta.promedio);

    let bEliminarH=document.createElement('button');
    bEliminarH.innerHTML=('x');
    bEliminarH.className='bEliminarH';

    let eliminar=()=>{

        //elimino la pregunta de la rama historial
        database.ref('preguntas/'+ 'historial/' +this.key).set(null);

        //elimino todos los puntajes de esa pregunta de la rama calificaciones
        database.ref('calificaciones/'+this.key).set(null);

    }


    bEliminarH.addEventListener('click', eliminar);
    component.appendChild(textPreguntaCont);
    component.appendChild(textPromedioCont);
    component.appendChild(bEliminarH);

    
    return component;

}
}