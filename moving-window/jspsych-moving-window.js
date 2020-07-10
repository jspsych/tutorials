/*
 * Example plugin template
 */

jsPsych.plugins["moving-window"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "moving-window",
    parameters: {
      words: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        default: 32 // spacebar
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // data saving
    var trial_data = {
      words: trial.words
    };
    var rt = [];
    var current_position = 0;
    var n_words = trial.words.split(' ').length;

    function create_moving_window(words, position){
      var word_list = words.split(' ');
      var stimulus = word_list.map(function(word, index){
        if(index == position){
          return word;
        } else {
          return "-".repeat(word.length);
        }
      }).join(' ')
      return stimulus;
    }

    function show_stimulus(position){
      display_element.innerHTML = "<p style='font-family: monospace; font-size: 28px;'>" + create_moving_window(trial.words, position) + "</p>";

      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    function after_response(response_info){
      rt.push(response_info.rt);

      current_position++;
      if(current_position == n_words){
        end_trial();
      } else {
        show_stimulus(current_position);
      }
    }

    function end_trial(){
      trial_data.rt = JSON.stringify(rt);

      // clear the display
      display_element.innerHTML = '';

      // end trial
      jsPsych.finishTrial(trial_data);
    }

    show_stimulus(current_position);    
  };

  return plugin;
})();
