//uploadFile.js

function uploadFile() {
	return {
		upload: function(element, callb) {
			var reader = new FileReader();

  			reader.onload = function(event) {
    			var image = event.target.result;
    			callb(image);
  			}
  			// when the file is read it triggers the onload event above.
  			reader.readAsDataURL(element.files[0]);
		}
	};
};