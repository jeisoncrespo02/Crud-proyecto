var nuevoIdProducto;
var db=openDatabase("itemDB", "1.0", "itemDB", 65535)
function limpiar(){
    document.getElementById("idProducto").value="";
    document.getElementById("tipo").value="";
    document.getElementById("nombre").value="";
    document.getElementById("precio").value="";
}
//Funcionalidad de los botones
//Eliminar registro
function eliminarRegistro(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaProductos1').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span.mid');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoIdProducto=lista[0];
        db.transaction(function(transaction){
            var sql="DELETE FROM productos1 WHERE idProducto="+nuevoIdProducto+";"
            transaction.executeSql(sql, undefined, function(){
                alert("Registro borrado satisfactoriamente, por favor actualice la tabla")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    });
}
//Editar registro.slice(-2, 0)
function editar(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaProductos1').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        document.getElementById("idProducto").value=lista[0];
        document.getElementById("tipo").value=lista[1];
        document.getElementById("nombre").value=lista[2];
        document.getElementById("precio").value=lista[3];
        nuevoIdProducto=lista[0];
    })
}
$(function(){
    //crear la tabla de productos
    $("#crearTabla").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE productos1 (idProducto NUMBER NOT NULL, tipo VARCHAR (100) NOT NULL, nombre VARCHAR(100) NOT NULL, precio NUMBER NOT NULL)";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla creada satisfactoriamente");
            }, function(transaction, err){
                alert(err.message);
            })
        });
    });
    //cargar la lista de productos
    $("#listar").click(function(){
        cargarDatos();
    })
    //funcion para listar y pintar tabla de productos en la pagina web
    function cargarDatos(){
        $("#listaProductos1").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM productos1";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    $("#listaProductos1").append('<tr><th>IdProducto</th><th>Tipo</th><th>Nombre</th><th>Precio</th><th></th><th></th></tr>');
                    for(var i=0; i<result.rows.length; i++){
                        var row=result.rows.item(i);
                        var idProducto=row.idProducto;
                        var tipo=row.tipo;
                        var nombre=row.nombre;
                        var precio=row.precio;
                        $("#listaProductos1").append('<tr id="fila'+idProducto+'"class="Reg_'+idProducto+'"><td><span class="mid">'+idProducto+'</span></td><td><span>'+tipo+'</span></td><td><span>'+nombre+'</span></td><td><span>'+precio+'</span></td><td><button type="button" id="'+idProducto+'" button class="btn btn-success" onclick="editar()"><img src="Librerias/Img/editar.png"/></button></td><td><button type="button" id="'+idProducto+'" button class="btn btn-danger" onclick="eliminarRegistro()"><img src="Librerias/Img/eliminar1.png"/></button></td></tr>');
                    }
                }else{
                    $("#listaProductos1").append('<tr><td colspan="5" align="center">No existen registros de productos</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message);
            })
        })
    }
    //insertar registros
    $("#insertar").click(function(){
        var idProducto=$("#idProducto").val();
        var tipo=$("#tipo").val();
        var nombre=$("#nombre").val();
        var precio=$("#precio").val();
        db.transaction(function(transaction){
            var sql="INSERT INTO productos1 (idProducto, tipo, nombre, precio) VALUES (?, ?, ?, ?)";
            transaction.executeSql(sql, [idProducto, tipo, nombre, precio], function(){

            }, function(transaction, err){
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })
    //Modificar un registro
    $("#modificar").click(function(){
        var nidProducto=$("#idProducto").val();
        var ntipo=$("#tipo").val();
        var nnombre=$("#nombre").val();
        var nprecio=$("#precio").val();
        db.transaction(function(transaction){
            var sql="UPDATE productos1 SET idProducto='"+nidProducto+"', tipo='"+ntipo+"', nombre='"+nnombre+"', precio='"+nprecio+"' WHERE idProducto="+nuevoIdProducto+";"
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
            var sql="DROP TABLE productos1";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla borrada satisfactoriamente, por favor, actualice la pagina")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    })
})