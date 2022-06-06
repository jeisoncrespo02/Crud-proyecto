var nuevoId;
var db=openDatabase("itemDB", "1.0", "itemDB", 65535)

function limpiar(){
    document.getElementById("idCliente").value="";
    document.getElementById("tipoHelado").value="";
    document.getElementById("precio").value="";
    document.getElementById("descuento").value="";
    document.getElementById("total").value="";
}

//Funcionalidad de los botones
//Eliminar registro
function eliminarRegistro(){
    $(document).one('click', 'button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaCompras').each(function(){
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
            var sql="DELETE FROM compras WHERE idCliente="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(){
                alert("Registro borrado satisfactoriamente, por favor actualice la tabla")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    });
}

$(function(){
    
    //crear la tabla
    $("#crearTabla").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE compras (idCliente NUMBER NOT NULL, tipoHelado VARCHAR(100) NOT NULL, precio NUMBER NOT NULL, descuento NUMBER NOT NULL, total NUMBER NOT NULL)";
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
        $("#listaCompras").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM compras";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.length){
                    $("#listaCompras").append('<tr><th>IdCliente</th><th>TipoHelado</th><th>Precio</th><th>Descuento</th><th>Total</th><th></th></tr>');
                    for(var i=0; i<result.rows.length; i++){
                        var row=result.rows.item(i);
                        var idCliente=row.idCliente;
                        var tipoHelado=row.tipoHelado;
                        var precio=row.precio;
                        var descuento=row.descuento;
                        var total=row.total;
                        $("#listaCompras").append('<tr id="fila'+idCliente+'"class="Reg_'+idCliente+'"><td><span class="mid">'+idCliente+'</span></td><td><span>'+tipoHelado+'</span></td><td><span>'+precio+'</span></td><td><span>'+descuento+'</span></td><td><span>'+total+'</span></td><td><button type="button" id="'+idCliente+'" button class="btn btn-danger" onclick="eliminarRegistro()"><img src="Librerias/Img/eliminar1.png"/></button></td></tr>');
                    }
                }else{
                    $("#listaCompras").append('<tr><td colspan="5" align="center">No existen registros de compras</td></tr>');
                }
            }, function(transaction, err){
                alert(err.message);
            })
        })
    }
    
    //insertar registros
    $("#comprar").click(function(){
        var idCliente=$("#idCliente").val();
        var tipoHelado=$("#tipoHelado").val();
        var precio=$("#precio").val();
        var descuento=$("#descuento").val();
        var total=$("#total").val();
        db.transaction(function(transaction){
            var sql="INSERT INTO compras (idCliente, tipoHelado, precio, descuento, total) VALUES (?, ?, ?, ?, ?)";
            transaction.executeSql(sql, [idCliente, tipoHelado, precio, descuento, total], function(){

            }, function(transaction, err){
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })
    
    //Para borrar toda la lista de Registros
    $("#borrarTodo").click(function(){
        if(!confirm("Esta seguro de borrar la tabla?, los datos se perderan permanentemente",""))
        return;
        db.transaction(function(transaction){
            var sql="DROP TABLE compras";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla borrada satisfactoriamente, por favor, actualice la pagina")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    })
})