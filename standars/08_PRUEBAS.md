# Estándares de Pruebas — Valle Grande

> Define los estándares de testing esperados en cada semestre. Las pruebas son parte del código entregable y se evalúan como categoría independiente.

---

## Criterios de Evaluación de Pruebas

| Criterio                                        | Peso en la categoría |
| ----------------------------------------------- | -------------------- |
| Presencia de pruebas en el proyecto             | 30 %                 |
| Nomenclatura correcta de clases y métodos test  | 20 %                 |
| Pruebas significativas (no triviales)           | 30 %                 |
| Cobertura de casos feliz Y casos de error       | 20 %                 |

> Si el proyecto NO tiene ninguna prueba, la categoría puntúa 0.

---

## 1. Expectativas por Semestre

| Semestre | Tipo de prueba esperada              | Cobertura mínima esperada      |
| -------- | ------------------------------------ | ------------------------------ |
| II       | Pruebas unitarias básicas en Service/DAO | Al menos 1 clase de test   |
| III      | Pruebas unitarias + integración básica | Service y Repository tests   |
| IV       | Pruebas unitarias + pruebas reactivas | Service con `StepVerifier`   |
| V·VI     | Unitarias + integración + pruebas de API | Cobertura > 60% de services |

---

## 2. Nomenclatura de Pruebas

### Nombre de clases de test

```
{ClaseAProbar}Test.java        → ClientServiceTest.java
{ClaseAProbar}Tests.java       → ClientRepositoryTests.java
```

### Nombre de métodos de test — patrón `given_when_then` ó `should_action_when_condition`

```java
// Patrón given_when_then
void given_activeClient_when_findById_then_returnClient()
void given_inactiveClient_when_findById_then_throwNotFoundException()
void given_invalidEmail_when_createClient_then_throwValidationException()

// Patrón should_action_when_condition (alternativo)
void should_returnClient_when_idExists()
void should_throwException_when_clientNotFound()
void should_createClient_when_dataIsValid()
```

---

## 3. Pruebas Unitarias — Spring Boot MVC (Semestre III)

```java
// test/service/ClientServiceTest.java
@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @InjectMocks
    private ClientServiceImpl clientService;

    @Mock
    private ClientRepository clientRepository;

    private Client testClient;

    @BeforeEach
    void setUp() {
        testClient = Client.builder()
            .id(1L)
            .fullName("Juan Pérez")
            .email("juan@vg.edu.pe")
            .status("A")
            .build();
    }

    @Test
    void should_returnClient_when_idExists() {
        // given
        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));

        // when
        Client result = clientService.findById(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getFullName()).isEqualTo("Juan Pérez");
        verify(clientRepository).findById(1L);
    }

    @Test
    void should_throwException_when_clientNotFound() {
        // given
        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> clientService.findById(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("99");
    }

    @Test
    void should_createClient_when_dataIsValid() {
        // given
        ClientRequest request = new ClientRequest("María García", "maria@vg.edu.pe");
        Client savedClient = Client.builder()
            .id(2L).fullName("María García").email("maria@vg.edu.pe").status("A").build();
        when(clientRepository.save(any(Client.class))).thenReturn(savedClient);

        // when
        Client result = clientService.create(request);

        // then
        assertThat(result.getId()).isEqualTo(2L);
        verify(clientRepository).save(any(Client.class));
    }
}
```

---

## 4. Pruebas Reactivas — Spring WebFlux (Semestre IV y V·VI)

Las pruebas reactivas usan `StepVerifier` de Project Reactor para verificar flujos `Mono` y `Flux`.

```java
// test/service/ClientServiceTest.java
@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @InjectMocks
    private ClientServiceImpl clientService;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void should_returnAllClients_when_findAll() {
        // given
        List<Client> clients = List.of(
            Client.builder().id(1L).fullName("Juan").status("A").build(),
            Client.builder().id(2L).fullName("María").status("A").build()
        );
        when(clientRepository.findAll()).thenReturn(Flux.fromIterable(clients));

        // when / then
        StepVerifier.create(clientService.findAll())
            .expectNextCount(2)
            .verifyComplete();
    }

    @Test
    void should_returnClient_when_idExists() {
        // given
        Client client = Client.builder().id(1L).fullName("Juan").email("juan@vg.edu.pe").build();
        when(clientRepository.findById(1L)).thenReturn(Mono.just(client));

        // when / then
        StepVerifier.create(clientService.findById(1L))
            .expectNextMatches(c -> c.getFullName().equals("Juan"))
            .verifyComplete();
    }

    @Test
    void should_throwNotFoundException_when_clientNotFound() {
        // given
        when(clientRepository.findById(99L)).thenReturn(Mono.empty());

        // when / then
        StepVerifier.create(clientService.findById(99L))
            .expectError(ResourceNotFoundException.class)
            .verify();
    }

    @Test
    void should_createClient_when_dataIsValid() {
        // given
        ClientRequest request = new ClientRequest("Ana Torres", "ana@vg.edu.pe");
        Client saved = Client.builder().id(3L).fullName("Ana Torres").build();
        when(clientRepository.save(any())).thenReturn(Mono.just(saved));

        // when / then
        StepVerifier.create(clientService.create(request))
            .expectNextMatches(c -> c.getId().equals(3L))
            .verifyComplete();
    }
}
```

---

## 5. Pruebas de Integración — Spring Boot

```java
// test/rest/ClientRestIntegrationTest.java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "spring.r2dbc.url=r2dbc:h2:mem:///testdb",
    "spring.r2dbc.username=sa"
})
class ClientRestIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void should_returnStatus200_when_getAll() {
        webTestClient
            .get().uri("/api/v1/clients")
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBodyList(ClientResponse.class)
            .hasSize(0);
    }

    @Test
    void should_returnStatus201_when_createValidClient() {
        ClientRequest request = new ClientRequest("Pedro López", "pedro@vg.edu.pe");

        webTestClient
            .post().uri("/api/v1/clients")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .exchange()
            .expectStatus().isCreated()
            .expectBody(ClientResponse.class)
            .value(res -> assertThat(res.getFullName()).isEqualTo("Pedro López"));
    }

    @Test
    void should_returnStatus400_when_invalidEmail() {
        ClientRequest request = new ClientRequest("Pedro", "no-es-un-email");

        webTestClient
            .post().uri("/api/v1/clients")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .exchange()
            .expectStatus().isBadRequest();
    }

    @Test
    void should_returnStatus404_when_clientNotFound() {
        webTestClient
            .get().uri("/api/v1/clients/999")
            .exchange()
            .expectStatus().isNotFound();
    }
}
```

---

## 6. Pruebas en Python Flask

```python
# tests/test_client_service.py
import unittest
from unittest.mock import patch, MagicMock
from app.services import client_service

class TestClientService(unittest.TestCase):

    @patch('app.services.client_service.sqlite3.connect')
    def test_get_all_returns_list(self, mock_connect):
        # given
        mock_conn = MagicMock()
        mock_conn.execute.return_value.fetchall.return_value = [
            {'id': 1, 'full_name': 'Juan', 'status': 'A'},
            {'id': 2, 'full_name': 'María', 'status': 'A'},
        ]
        mock_conn.row_factory = None
        mock_connect.return_value = mock_conn

        # when
        result = client_service.get_all()

        # then
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]['full_name'], 'Juan')

    @patch('app.services.client_service.sqlite3.connect')
    def test_find_by_id_returns_none_when_not_found(self, mock_connect):
        mock_conn = MagicMock()
        mock_conn.execute.return_value.fetchone.return_value = None
        mock_connect.return_value = mock_conn

        result = client_service.find_by_id(999)

        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()
```

---

## 7. Pruebas en Java Desktop — Semestre II

```java
// prueba/ClientServiceTest.java
public class ClientServiceTest {

    private ClientService clientService;

    @Before
    public void setUp() {
        clientService = new ClientService();
    }

    @Test
    public void testValidateEmail_withValidEmail_shouldReturnTrue() {
        // given
        String email = "usuario@vallegrande.edu.pe";

        // when
        boolean result = clientService.isValidEmail(email);

        // then
        assertTrue("El email válido debe retornar true", result);
    }

    @Test
    public void testValidateEmail_withInvalidEmail_shouldReturnFalse() {
        // given
        String email = "no-es-email";

        // when
        boolean result = clientService.isValidEmail(email);

        // then
        assertFalse("El email inválido debe retornar false", result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSave_withNullClient_shouldThrowException() {
        // when
        clientService.save(null);
    }
}
```

---

## 8. Pruebas de Custom Hooks — React (TypeScript)

```typescript
// src/features/users/__tests__/useUsers.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../hooks/useUsers';
import { userService } from '../../../core/services/user.service';

jest.mock('../../../core/services/user.service');

describe('useUsers', () => {
    const mockUsers = [
        { id: '1', fullName: 'Juan Pérez', email: 'juan@vg.edu.pe', status: 'A' }
    ];

    it('should return users on successful fetch', async () => {
        (userService.getAll as jest.Mock).mockResolvedValue({
            data: { data: mockUsers }
        });

        const { result } = renderHook(() => useUsers());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.users).toHaveLength(1);
        expect(result.current.error).toBeNull();
    });

    it('should set error on failed fetch', async () => {
        (userService.getAll as jest.Mock).mockRejectedValue(
            new Error('Network error')
        );

        const { result } = renderHook(() => useUsers());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Network error');
        expect(result.current.users).toHaveLength(0);
    });
});
```

---

## 9. Malas Prácticas en Pruebas

```java
// MAL — prueba trivial que no verifica nada útil
@Test
void testCreate() {
    assertNotNull(clientService);   // ← solo verifica que se inyectó, no la lógica
}

// MAL — prueba sin assertions
@Test
void testFindAll() {
    clientService.findAll();        // ← no verifica el resultado
}

// MAL — prueba que siempre pasa
@Test
void testSave() {
    assertTrue(true);               // ← sin sentido
}

// MAL — no usa @BeforeEach para setup
@Test
void testUpdate() {
    ClientService svc = new ClientService();  // ← instanciación manual sin mocks
    Client c = new Client();
    // ...
}
```

---

## 10. Checklist de Pruebas

- [ ] Existe al menos una clase de prueba en el proyecto
- [ ] Las pruebas están en `src/test/` (Java) ó `tests/` (Python)
- [ ] Nombre de clases: `{Clase}Test.java` ó `test_{modulo}.py`
- [ ] Nombres de métodos descriptivos (given_when_then ó should_action_when_condition)
- [ ] Cada test tiene: setup (given), ejecución (when) y verificación (then/assert)
- [ ] Se prueba el caso feliz Y el caso de error
- [ ] No hay pruebas triviales sin assertions reales
- [ ] Las pruebas reactivas usan `StepVerifier` (WebFlux)
- [ ] Las pruebas de integración usan BD en memoria (H2, SQLite) ó containers
