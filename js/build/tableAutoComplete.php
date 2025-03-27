<?php

	$cssSrc = file_get_contents(__DIR__ . '/../../css/tableAutoComplete.css');

	if (isset($_GET['js'])) {
		$jsSrc = file_get_contents(__DIR__ . '/tableAutoComplete.js');
		echo str_replace('CSS_CODE_REPLACEMENT', $cssSrc, $jsSrc);
	} else {
		header('Content-Type: text/plain; charset=utf-8');
		$tsSrc = file_get_contents(__DIR__ . '/../../src/tableAutoComplete.ts');
		echo str_replace(['CSS_CODE_REPLACEMENT', 'var tableAutoCompleteFactory = '], [$cssSrc, ''], $tsSrc);
	}