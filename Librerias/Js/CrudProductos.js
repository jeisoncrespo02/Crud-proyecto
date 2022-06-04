var nuevoId;
var db=openDatabase("itemDB", "1.0", "itemDB", 65535)
function limpiar(){
    document.getElementById("tipo").value="";
    document.getElementById("idproducto").value="";
    document.getElementById("nombre").value="";
    document.getElementById("precio").value="";
}
//Funcionalidad de los botones
//Eliminar registro
function eliminarRegistro(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaProductos').each(function(){
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
//Editar registro.slice(-2, 0)
function editar(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaProductos').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        document.getElementById("tipo").value=lista[0];
        document.getElementById("idproducto").value=lista[1];
        document.getElementById("nombre").value=lista[2];
        document.getElementById("precio").value=lista[3];
        nuevoId=lista[0];
    })
}
$(function(){
    //crear la tabla de productos
    $("#crearTabla").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE clientes (tipo tipo NOT NULL, idproducto VARCHAR(100) NOT NULL, nombre VARCHAR(100) NOT NULL, precio VARCHAR(100) NOT NULL)";
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
        $("#listaProductos").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM clientes";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    $("#listaProductos").append('<tr><th>Tipo</th><th>IdProducto</th><th>Nombre</th><th>Precio</th><th></th><th></th></tr>');
                    for(var i=0; i<result.rows.length; i++){
                        var row=result.rows.item(i);
                        var identificacion=row.identificacion;
                        var nombre=row.nombre;
                        var ocupacion=row.ocupacion;
                        var sisben=row.sisben;
                        $("#listaProducto").append('<tr id="fila'+tipo+'"class="Reg_'+idproducto+'"><td><span class="mid">'+tipo+'</span></td><td><span>'+idproducto+'</span></td><td><span>'+nombre+'</span></td><td><span>'+precio+'</span></td><td><button type="button" id="'+identificacion+'" button class="btn btn-success" onclick="editar()"><img src="Librerias/Img/editar.png"/></button></td><td><button type="button" id="'+identificacion+'" button class="btn btn-danger" onclick="eliminarRegistro()"><img src="Librerias/Img/eliminar1.png"/></button></td></tr>');
                    }
                }else{
                    $("#listaProductos").append('<tr><td colspan="5" align="center">No existen registros de clientes</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message);
            })
        })
    }
    //insertar registros
    $("#insertar").click(function(){
        var identificacion=$("#tipo").val();
        var nombre=$("#idproducto").val();
        var ocupacion=$("#nombre").val();
        var sisben=$("#precio").val();
        db.transaction(function(transaction){
            var sql="INSERT INTO clientes (tipo, idproducto, nombre, precio) VALUES (?, ?, ?, ?)";
            transaction.executeSql(sql, [tipo, idproducto, nombre, precio], function(){

            }, function(transaction, err){
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })
    //Modificar un registro
    $("#modificar").click(function(){
        var ntipo=$("#tipo").val();
        var nidproducto=$("#idproducto").val();
        var nnombre=$("#nombre").val();
        var nprecio=$("#precio").val();
        db.transaction(function(transaction){
            var sql="UPDATE clientes SET tipo='"+ntipo+"', idproducto='"+nidproducto+"', nombre='"+nnombre+"', precio='"+nprecio+"' WHERE tipo="+nuevoId+";"
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