<?php

namespace App\Entity;

use App\Enum\UserRole;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: '`user`')]
class User implements PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: Types::GUID, unique: true)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 12)]
    private ?string $username = null;

    #[ORM\Column(length: 70)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(enumType: UserRole::class)]
    private ?UserRole $role = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    /**
     * @var Collection<int, Classroom>
     */
    #[ORM\OneToMany(targetEntity: Classroom::class, mappedBy: 'teacher', orphanRemoval: true)]
    private Collection $classrooms;

    /**
     * @var Collection<int, StudentClass>
     */
    #[ORM\OneToMany(targetEntity: StudentClass::class, mappedBy: 'student', orphanRemoval: true)]
    private Collection $enrolledClasses;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $picture = null;

    /**
     * @var Collection<int, Test>
     */
    #[ORM\OneToMany(targetEntity: Test::class, mappedBy: 'author')]
    private Collection $created_tests;

    /**
     * @var Collection<int, TestResult>
     */
    #[ORM\OneToMany(targetEntity: TestResult::class, mappedBy: 'student')]
    private Collection $testResults;

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->created_at = new \DateTimeImmutable();
    }

    public function __construct()
    {
        $this->id = Uuid::v4()->toRfc4122();
        $this->classrooms = new ArrayCollection();
        $this->enrolledClasses = new ArrayCollection();
        $this->created_tests = new ArrayCollection();
        $this->testResults = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;
        
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRole(): ?UserRole
    {
        return $this->role;
    }

    public function setRole(UserRole $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    /**
     * @return Collection<int, Classroom>
     */
    public function getClassrooms(): Collection
    {
        return $this->classrooms;
    }

    /**
     * @return Collection<int, StudentClass>
     */
    public function getEnrolledClasses(): Collection
    {
        return $this->enrolledClasses;
    }

    public function addEnrolledClass(StudentClass $enrollment): static
    {
        if (!$this->enrolledClasses->contains($enrollment)) {
            $this->enrolledClasses->add($enrollment);
            $enrollment->setStudent($this);
        }

        return $this;
    }

    public function removeEnrolledClass(StudentClass $enrollment): static
    {
        if ($this->enrolledClasses->removeElement($enrollment)) {
            // Not setting null because the entity has a composite primary key
        }

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * @return Collection<int, Test>
     */
    public function getCreatedTests(): Collection
    {
        return $this->created_tests;
    }

    public function addCreatedTest(Test $createdTest): static
    {
        if (!$this->created_tests->contains($createdTest)) {
            $this->created_tests->add($createdTest);
            $createdTest->setAuthor($this);
        }

        return $this;
    }

    public function removeCreatedTest(Test $createdTest): static
    {
        if ($this->created_tests->removeElement($createdTest)) {
            // set the owning side to null (unless already changed)
            if ($createdTest->getAuthor() === $this) {
                $createdTest->setAuthor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TestResult>
     */
    public function getTestResults(): Collection
    {
        return $this->testResults;
    }

    public function addTestResult(TestResult $testResult): static
    {
        if (!$this->testResults->contains($testResult)) {
            $this->testResults->add($testResult);
            $testResult->setStudent($this);
        }

        return $this;
    }

    public function removeTestResult(TestResult $testResult): static
    {
        if ($this->testResults->removeElement($testResult)) {
            // set the owning side to null (unless already changed)
            if ($testResult->getStudent() === $this) {
                $testResult->setStudent(null);
            }
        }

        return $this;
    }
}
