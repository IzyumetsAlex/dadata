//API url
var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

//здесь будут храниться данные о найденных объектах
var suggestions = {};

/**
 * Первое поле поиска
 */
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
                    suggestions = {};
                    alert('Какая-то ошибка(');
                } else {
                    suggestions = data.suggestions;
                    $.each(data.suggestions, function(i, row){
                        $result.append('<li><a href="#" onclick="setSearchValue(this, ' + i + ')">' + row.value + '</a></li>');
                    });
                }
            }
        });
    }
});

/**
 * Реакция на выбор элемента в первом поле поиска
 * @param e
 * @param index
 * @returns {boolean}
 */
function setSearchValue(e, index) {
    var selectedText = $(e).text();
    $('#search_input').val(selectedText);
    $('#search_result').html('');
    setSuggestionData(index);
    return false;
}

/**
 * Второе поле поиска
 */
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
            suggestions = data.suggestions;
            return {
                results: $.map(data.suggestions, function (item, i) {
                    return {
                        text: item.value,
                        //slug: item.slug,
                        id: i
                    }
                })
            };
        }
    },
});

$('#search_input2').on('select2:select', function (e) {
    var sugg_index = e.params.data.id;
    setSuggestionData(sugg_index)
});

/**
 * Показывает данные о найденном объекте
 * @param index
 */
function setSuggestionData(index) {
    var sugg_data = suggestions[index];

    var sugg_html = [];
    $.each(sugg_data.data, function(name, value){
        sugg_html.push(name + ': ' + value);
    });

    $('#search_rexult_info').html(sugg_html.join('<br>'));
}