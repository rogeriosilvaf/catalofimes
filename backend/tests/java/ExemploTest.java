package tests.java

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ExemploTest {

    @Test
    void testSomaSimples() {
        int resultado = 2 + 2;
        assertEquals(4, resultado, "A soma deve ser igual a 4");
    }
}