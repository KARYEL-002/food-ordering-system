<?php

namespace App\Exceptions;

use Exception;

class LoginException extends Exception
{
    public $type;
    public $data;

    public function __construct($message = "", $type = 'error', $data = [], $code = 0)
    {
        parent::__construct($message, $code);
        $this->type = $type;
        $this->data = $data;
    }
}
