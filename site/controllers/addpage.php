<?php 

try {

  $newPage = page('blog')->children()->create('my-new-article', 'article', array(
    'title' => 'My new article',
    'date'  => '2012-12-12 22:33',
    'text'  => 'This is my new article',
    'tags'  => 'article, text, readable'
  ));

  echo 'The new page has been created';

} catch(Exception $e) {

  echo $e->getMessage();

}

};