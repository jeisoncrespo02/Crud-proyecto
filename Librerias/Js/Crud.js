var nuevoId;
var db=openDatabase("itemDB", "1.0", "itemDB", 65535)

function limpiar(){
    document.getElementById("identificacion").value="";
    document.getElementById("nombre").value="";
    document.getElementById("ocupacion").value="";
    document.getElementById("sisben").value="";
}

//Funcionalidad de los botones
//Eliminar registro
function eliminarRegistro(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaClientes').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span.mid');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoId=lista[0];
        db.transaction(function(transaction){
            var sql="DELETE FROM clientes WHERE identificacion="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(){
                alert("Registro borrado satisfactoriamente, por favor actualice la tabla")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    });
}

//Editar registro
function editar(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaClientes').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        document.getElementById("identificacion").value=lista[0];
        document.getElementById("nombre").value=lista[1];
        document.getElementById("ocupacion").value=lista[2];
        document.getElementById("sisben").value=lista[3];
        nuevoId=lista[0];
    })
}

$(function(){
    
    //crear la tabla
    $("#crearTabla").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE clientes (identificacion NUMBER NOT NULL, nombre VARCHAR(100) NOT NULL, ocupacion VARCHAR(100) NOT NULL, sisben DECIMAL(4,2) NOT NULL)";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla creada satisfactoriamente");
            }, function(transaction, err){
                alert(err.message);
            })
        });
    });
    
    //cargar la lista
    $("#listar").click(function(){
        cargarDatos();
    })
    
    //funcion para listar y pintar tabla en la pagina web
    function cargarDatos(){
        $("#listaClientes").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM clientes";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    $("#listaClientes").append('<tr><th>Identificacion</th><th>Nombre</th><th>Ocupacion</th><th>Sisben</th><th></th><th></th></tr>');
                    for(var i=0; i<result.rows.length; i++){
                        var row=result.rows.item(i);
                        var identificacion=row.identificacion;
                        var nombre=row.nombre;
                        var ocupacion=row.ocupacion;
                        var sisben=row.sisben;
                        $("#listaClientes").append('<tr id="fila'+identificacion+'"class="Reg_'+identificacion+'"><td><span class="mid">'+identificacion+'</span></td><td><span>'+nombre+'</span></td><td><span>'+ocupacion+'</span></td><td><span>'+sisben+'</span></td><td><button type="button" id="'+identificacion+'" button class="btn btn-success" onclick="editar()"><img src="Librerias/Img/editar.png"/></button></td><td><button type="button" id="'+identificacion+'" button class="btn btn-danger" onclick="eliminarRegistro()"><img src="Librerias/Img/eliminar1.png"/></button></td></tr>');
                    }
                }else{
                    $("#listaClientes").append('<tr><td colspan="5" align="center">No existen registros de clientes</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message);
            })
        })
    }
    
    //insertar registros
    $("#insertar").click(function(){
        var identificacion=$("#identificacion").val();
        var nombre=$("#nombre").val();
        var ocupacion=$("#ocupacion").val();
        var sisben=$("#sisben").val();
        db.transaction(function(transaction){
            var sql="INSERT INTO clientes (identificacion, nombre, ocupacion, sisben) VALUES (?, ?, ?, ?)";
            transaction.executeSql(sql, [identificacion, nombre, ocupacion, sisben], function(){

            }, function(transaction, err){
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })
    
    //Modificar un registro
    $("#modificar").click(function(){
        var nidentificacion=$("#identificacion").val();
        var nnombre=$("#nombre").val();
        var nocupacion=$("#ocupacion").val();
        var nsisben=$("#sisben").val();
        db.transaction(function(transaction){
            var sql="UPDATE clientes SET identificacion='"+nidentificacion+"', nombre='"+nnombre+"', ocupacion='"+nocupacion+"', sisben='"+nsisben+"' WHERE identificacion="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(){
                cargarDatos();
                limpiar();
            }, function(transaction, err){
                alert(err.message);
            })
        })
    })
    
    //Para borrar toda la lista de Registros
    $("#borrarTodo").click(function(){
        if(!confirm("Esta seguro de borrar la tabla?, los datos se perderan permanentemente",""))
        return;
        db.transaction(function(transaction){
            var sql="DROP TABLE clientes";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla borrada satisfactoriamente, por favor, actualice la pagina")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    })
})