var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

$('#search_input').on('keyup', function(e){
    var query = $(this).val(),
        $result = $('#search_result');

    $result.html('');

    if (query.length >= 3) {
        $.ajax({
            url: url,
            data: JSON.stringify({query: query}),
            type: 'post',
            //dataType: 'json',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + API_KEY
            },
            success: function(data) {
                if (!data.suggestions) {
                    alert('Какая-то ошибка(');
                } else {
                    $.each(data.suggestions, function(i, row){
                        $result.append('<li><a href="#" onclick="setSearchValue(this)">' + row.value + '</a></li>');
                    });
                }
            }
        });
    }
});

function setSearchValue(e)
{
    var selectedText = $(e).text();
    $('#search_input').val(selectedText);
    $('#search_result').html('');
}

$("#search_input2").select2({
    placeholder: "Введите название",
    minimumInputLength: 3,
    width: '500px',
    language: 'ru-RU',
    ajax: {
        url: url,
        //data: JSON.stringify({query: query}),
        data: function (term, page) {return JSON.stringify({query: term.term})},
        type: 'post',
        //dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + API_KEY
        },
        processResults: function(data) {
            return {
                results: $.map(data.suggestions, function (item) {
                    return {
                        text: item.value,
                        //slug: item.slug,
                        id: item.value
                    }
                })
            };
        }
    },
});
