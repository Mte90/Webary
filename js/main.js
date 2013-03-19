$(function(){

	function loadJson(file){
	//load glossary
		var path = 'glossary/'+ file +'.json';
		
		$.getJSON(path,function(data){
				var items = [];
				categories = [];
				letter = [];
				check = [];
				check2 = [];
				$.each(data.glossary, function(key, val) {
					//create list of categories
					if(typeof check[val.category] == 'undefined' ) {
						categories.push(val.category);
						check[val.category] = 1;
					}
					//create list of firstletter
					firstLetter = val.term.charAt(0);
					if(typeof check2[firstLetter] == 'undefined') {
						letter.push(firstLetter);
						check2[firstLetter] = 1;
					}

					items.push('<li id="' + val.term + '" class="'+val.category+' '+ firstLetter +' all"><h4>' + val.term + ':</h4><pre>' + val.definition + '</pre></li>');
				});
				$('<ul/>', {'class': 'list',html: items.sort().join('')}).prependTo('.list-glossary');
				
				$('.author').text(data.author).attr('href',data.site);
				$('.description').text(data.description);
				$('.version').text(data.version);
				
				createMenu(categories.sort());
				createListLetter(letter.sort());
		});
	}

	function createMenu(categories){
	//create categories menu
		var menus = [];
		menus.push('<li class="menu-child"><a class="menu-category" data-type="all" href="#all">All</a></li>');

		$.each(categories,function(i,val) {
			menus.push('<li class="menu-child"><a class="menu-category" data-type="'+val+'" href="#'+val+'">' + val +'</a></li>');
		});
		
		$('<ul/>', {'class': 'menu nav nav-list',html: menus.join('')}).appendTo('.menu-span');
		
	}

	function createListLetter(list){
		//create letter list
		var lists = [];

		$.each(list,function(i,val) {
			lists.push('<li class="list-child"><b><a class="list-char" data-type="'+val+'" href="#'+val+'">' + val +'</a></b></li>');
		});

		$('<ul/>', {'class': 'letter',html: lists.join('')}).appendTo('.list-chars');
	}

	$(document).on('click','.menu-category',function(){
		//filter by category
		$('.list-char').css('font-weight','normal');
		$('.menu-category').css('font-weight','normal');
		$(this).css('font-weight','bold');
		$('.list li').slideDown().not('.'+$(this).data('type')).slideUp();
	});

	$(document).on('click','.list-char',function(){
		//filter by letter
		$('.menu-category').css('font-weight','normal');
		$('.list-char').css('font-weight','normal');
		$(this).css('font-weight','bold');
		$('.list li').slideDown().not('.'+$(this).data('type')).slideUp();
	});
	
	function listFilter(list) { 
    var  input = $('.search-query');

		$(input).change( function () {
			var filter = $(this).val();
			if(filter) {
			// this finds all links in a list that contain the input,
			// and hide the ones not containing the input while showing the ones that do
				$(list).find("h4:not(:Contains(" + filter + "))").parent().slideUp();
				$(list).find("h4:Contains(" + filter + ")").parent().slideDown();
			} else {
				$(list).find("li").slideDown();
			}
			return false;
		}).keyup( function () {
        // fire the above change event after every letter
			$(this).change();
		});
  }

  loadJson('ita');
  listFilter($(".list-glossary"));
});
